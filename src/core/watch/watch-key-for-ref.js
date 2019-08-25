import pickDepFns from '../base/pick-dep-fns';

export default function (refCtx, stateModule, oldState, committedState, isBeforeMount) {
  if (!refCtx.hasWatchFn) return true;
  const { watchDep, module: refModule, ccUniqueKey } = refCtx;

  let shouldCurrentRefUpdate = true;
  // 触发有stateKey依赖列表相关的watch函数
  const { pickedFns, setted, changed } = pickDepFns(isBeforeMount, 'ref', 'watch', watchDep, stateModule, oldState, committedState, ccUniqueKey);
  pickedFns.forEach(({ fn, retKey, depKeys }) => {
    const fnCtx = { retKey, setted, changed, stateModule, refModule, oldState, committedState, refCtx };
    const fistDepKey = depKeys[0];

    let ret;
    if (depKeys.length === 1 && fistDepKey !== '*') {
      ret = fn(committedState[fistDepKey], oldState[fistDepKey], fnCtx, refCtx);
    } else {
      ret = fn(committedState, oldState, fnCtx);
    }

    //实例里只要有一个watch函数返回false，就会阻碍当前实例的ui被更新
    if (ret === false) shouldCurrentRefUpdate = false;
  });

  return shouldCurrentRefUpdate;
}
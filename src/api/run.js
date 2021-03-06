import startup from './startup';
import * as util from '../support/util';
import { NOT_A_JSON } from '../support/priv-constant';
import ccContext from '../cc-context';
import pendingModules from '../cc-context/pending-modules';
import getLifecycle from '../core/param/get-lifecycle';

const { isPJO, okeys, evalState } = util;
const pError = label => {
  throw new Error(`[[run]]: param error, ${label} ${NOT_A_JSON}`);
}

// option:
// middlewares, plugins, isStrict, isDebug, errorHandler, isHot,
// autoCreateDispatcher, bindCtxToMethod,
// computedCompare, watchCompare, watchImmediate

/**
 * run will call startup
 * @param {{ [moduleName:string]: config:{state:object|()=>object, reducer:object, watch:object, computed:object, init:object} }} store
 * @param {{isStrict:boolean}} options
 */

export default function (store = {}, options = {}) {
  if (!isPJO(store)) pError('store');
  if (!isPJO(options)) pError('options');

  const storeConf = {
    store: {},
    reducer: {},
    watch: {},
    computed: {},
    lifecycle: {},
  }

  const buildStoreConf = (m, moduleConf) => {
    const { state, reducer, watch, computed } = moduleConf;
    if (storeConf.store[m]) {
      throw new Error(`run api error: module${m} duplicate`);
    }

    storeConf.store[m] = evalState(state);
    if (typeof state === 'function') ccContext.moduleName_stateFn_[m] = state;

    storeConf.reducer[m] = reducer;
    storeConf.watch[m] = watch;
    storeConf.computed[m] = computed;
    storeConf.lifecycle[m] = getLifecycle(moduleConf);
  }

  // traversal moduleNames
  okeys(store).forEach(m => buildStoreConf(m, store[m]));

  // these modules pushed by configure api
  pendingModules.forEach(({ module, config }) => {
    util.justTip(`configure pending module[${module}]`);
    buildStoreConf(module, config)
  });

  pendingModules.length = 0;// clear pending modules
  startup(storeConf, options);
}

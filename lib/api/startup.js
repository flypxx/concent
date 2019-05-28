"use strict";

var _interopRequireWildcard = require("@babel/runtime/helpers/interopRequireWildcard");

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

exports.__esModule = true;
exports["default"] = _default;

var _react = _interopRequireDefault(require("react"));

var _reactDom = _interopRequireDefault(require("react-dom"));

var _util = _interopRequireWildcard(require("../support/util"));

var _constant = require("../support/constant");

var _ccContext = _interopRequireDefault(require("../cc-context"));

var _createDispatcher = _interopRequireDefault(require("./create-dispatcher"));

var boot = _interopRequireWildcard(require("../core/base/boot"));

function _default(_temp) {
  var _ref = _temp === void 0 ? {} : _temp,
      _ref$store = _ref.store,
      store = _ref$store === void 0 ? {} : _ref$store,
      _ref$reducer = _ref.reducer,
      reducer = _ref$reducer === void 0 ? {} : _ref$reducer,
      _ref$init = _ref.init,
      init = _ref$init === void 0 ? null : _ref$init,
      _ref$computed = _ref.computed,
      computed = _ref$computed === void 0 ? {} : _ref$computed,
      _ref$watch = _ref.watch,
      watch = _ref$watch === void 0 ? {} : _ref$watch,
      _ref$sharedToGlobalMa = _ref.sharedToGlobalMapping,
      sharedToGlobalMapping = _ref$sharedToGlobalMa === void 0 ? {} : _ref$sharedToGlobalMa,
      _ref$moduleSingleClas = _ref.moduleSingleClass,
      moduleSingleClass = _ref$moduleSingleClas === void 0 ? {} : _ref$moduleSingleClas,
      _ref$middlewares = _ref.middlewares,
      middlewares = _ref$middlewares === void 0 ? [] : _ref$middlewares,
      _ref$isStrict = _ref.isStrict,
      isStrict = _ref$isStrict === void 0 ? false : _ref$isStrict,
      _ref$isDebug = _ref.isDebug,
      isDebug = _ref$isDebug === void 0 ? false : _ref$isDebug,
      _ref$errorHandler = _ref.errorHandler,
      errorHandler = _ref$errorHandler === void 0 ? null : _ref$errorHandler,
      _ref$isHot = _ref.isHot,
      isHot = _ref$isHot === void 0 ? false : _ref$isHot,
      _ref$autoCreateDispat = _ref.autoCreateDispatcher,
      autoCreateDispatcher = _ref$autoCreateDispat === void 0 ? true : _ref$autoCreateDispat;

  try {
    _util["default"].justTip("cc version " + _ccContext["default"].info.version);

    _ccContext["default"].isHot = isHot;
    _ccContext["default"].errorHandler = errorHandler;
    _ccContext["default"].isStrict = isStrict;
    _ccContext["default"].isDebug = isDebug;

    if (_ccContext["default"].isCcAlreadyStartup) {
      var err = _util["default"].makeError(_constant.ERR.CC_ALREADY_STARTUP);

      if (_util["default"].isHotReloadMode()) {
        (0, _util.clearObject)(_ccContext["default"].globalStateKeys);
        (0, _util.clearObject)(_ccContext["default"].reducer._reducer);
        (0, _util.clearObject)(_ccContext["default"].store._state, [_constant.MODULE_DEFAULT, _constant.MODULE_CC, _constant.MODULE_GLOBAL], {});
        (0, _util.clearObject)(_ccContext["default"].computed._computedFn);
        (0, _util.clearObject)(_ccContext["default"].computed._computedValue);
        (0, _util.clearObject)(_ccContext["default"].event_handlers_);
        (0, _util.clearObject)(_ccContext["default"].ccUniqueKey_handlerKeys_);
        var cct = _ccContext["default"].ccClassKey_ccClassContext_;
        Object.keys(cct).forEach(function (ccClassKey) {
          var ctx = cct[ccClassKey];
          (0, _util.clearObject)(ctx.ccKeys);
        });
        (0, _util.clearObject)(_ccContext["default"].handlerKey_handler_);
        (0, _util.clearObject)(_ccContext["default"].ccKey_ref_, [_constant.CC_DISPATCHER]);
        (0, _util.clearObject)(_ccContext["default"].refs, [_constant.CC_DISPATCHER]);
        (0, _util.clearObject)(_ccContext["default"].fragmentCcKeys);
        (0, _util.clearObject)(_ccContext["default"].ccKey_option_);

        _util["default"].hotReloadWarning(err);
      } else throw err;
    }

    boot.configSharedToGlobalMapping(sharedToGlobalMapping);
    boot.configModuleSingleClass(moduleSingleClass);
    boot.configStoreState(store);
    boot.configRootReducer(reducer);
    boot.configRootComputed(computed);
    boot.configRootWatch(watch);
    boot.executeRootInit(init);
    boot.configMiddlewares(middlewares);

    if (autoCreateDispatcher) {
      if (!_ccContext["default"].refs[_constant.CC_DISPATCHER]) {
        var Dispatcher = (0, _createDispatcher["default"])();
        var box = document.querySelector("#" + _constant.CC_DISPATCHER_BOX);

        if (!box) {
          box = document.createElement('div');
          box.id = _constant.CC_DISPATCHER_BOX;
          var boxSt = box.style;
          boxSt.position = 'fixed';
          boxSt.left = 0;
          boxSt.top = 0;
          boxSt.display = 'none';
          boxSt.zIndex = -888666;
          document.body.append(box);
        }

        _reactDom["default"].render(_react["default"].createElement(Dispatcher), box);

        _util["default"].justTip("[[startUp]]: cc create a CcDispatcher automatically");
      } else {
        _util["default"].justTip("[[startUp]]: CcDispatcher existed already");
      }
    } else {
      throw 'customizing Dispatcher is not allowed in current version cc';
    }

    if (window) {
      window.CC_CONTEXT = _ccContext["default"];
      window.ccc = _ccContext["default"];
    }

    _ccContext["default"].isCcAlreadyStartup = true;
  } catch (err) {
    if (errorHandler) errorHandler(err);else throw err;
  }
}
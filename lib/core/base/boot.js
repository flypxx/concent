"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _interopRequireWildcard = require("@babel/runtime/helpers/interopRequireWildcard");

exports.__esModule = true;
exports.configStoreState = configStoreState;
exports.configRootReducer = configRootReducer;
exports.configRootComputed = configRootComputed;
exports.configRootWatch = configRootWatch;
exports.configRootLifecycle = configRootLifecycle;
exports.configMiddlewares = configMiddlewares;
exports.configPlugins = configPlugins;
exports["default"] = void 0;

var util = _interopRequireWildcard(require("../../support/util"));

var _privConstant = require("../../support/priv-constant");

var _constant = require("../../support/constant");

var _ccContext = _interopRequireDefault(require("../../cc-context"));

var _initModuleState = _interopRequireDefault(require("../state/init-module-state"));

var _initModuleReducer = _interopRequireDefault(require("../reducer/init-module-reducer"));

var _initModuleWatch = _interopRequireDefault(require("../watch/init-module-watch"));

var _initModuleComputed = _interopRequireDefault(require("../computed/init-module-computed"));

var _initModuleLifecycle = _interopRequireDefault(require("./init-module-lifecycle"));

var _plugin = require("../plugin");

var isPJO = util.isPJO,
    okeys = util.okeys,
    isObject = util.isObject;

function checkObj(rootObj, tag) {
  if (!isPJO(rootObj)) {
    throw new Error(tag + " " + _privConstant.NOT_A_JSON);
  }
}

function configStoreState(storeState) {
  checkObj(storeState, 'state');
  delete storeState[_constant.MODULE_VOID];
  delete storeState[_constant.MODULE_CC];
  if (!isObject(storeState[_constant.MODULE_GLOBAL])) storeState[_constant.MODULE_GLOBAL] = {};
  if (!isObject(storeState[_constant.MODULE_DEFAULT])) storeState[_constant.MODULE_DEFAULT] = {};
  var moduleNames = okeys(storeState);
  var len = moduleNames.length;

  for (var i = 0; i < len; i++) {
    var moduleName = moduleNames[i];
    var moduleState = storeState[moduleName];
    (0, _initModuleState["default"])(moduleName, moduleState);
  }
}
/**
 * @param {{[moduleName:string]:{[reducerFnType:string]:function}}} rootReducer 
 */


function configRootReducer(rootReducer) {
  checkObj(rootReducer, 'reducer');
  if (!isObject(rootReducer[_constant.MODULE_DEFAULT])) rootReducer[_constant.MODULE_DEFAULT] = {};
  if (!isObject(rootReducer[_constant.MODULE_GLOBAL])) rootReducer[_constant.MODULE_GLOBAL] = {};
  okeys(rootReducer).forEach(function (m) {
    return (0, _initModuleReducer["default"])(m, rootReducer[m]);
  });
}

function configRootComputed(rootComputed) {
  checkObj(rootComputed, 'computed');
  okeys(rootComputed).forEach(function (m) {
    return (0, _initModuleComputed["default"])(m, rootComputed[m]);
  });
}

function configRootWatch(rootWatch) {
  checkObj(rootWatch, 'watch');
  okeys(rootWatch).forEach(function (m) {
    return (0, _initModuleWatch["default"])(m, rootWatch[m]);
  });
}

function configRootLifecycle(rootLifecycle) {
  checkObj(rootLifecycle, 'lifecycle');
  okeys(rootLifecycle).forEach(function (m) {
    return (0, _initModuleLifecycle["default"])(m, rootLifecycle[m]);
  });
}

function configMiddlewares(middlewares) {
  if (middlewares.length > 0) {
    var ccMiddlewares = _ccContext["default"].middlewares;
    ccMiddlewares.length = 0; //防止热加载重复多次载入middlewares

    middlewares.forEach(function (m) {
      return ccMiddlewares.push(m);
    });
  }
}

function configPlugins(plugins) {
  if (plugins.length > 0) {
    var ccPlugins = _ccContext["default"].plugins;
    ccPlugins.length = 0; //防止热加载重复多次载入plugins

    (0, _plugin.clearCbs)(); //清理掉已映射好的插件回调

    var pluginNameMap = {};
    plugins.forEach(function (p) {
      ccPlugins.push(p);

      if (p.install) {
        var pluginInfo = p.install(_plugin.on);
        var e = new Error('plugin.install must return result:{name:string, options?:object}');
        if (!pluginInfo) throw e;
        var pluginName = pluginInfo.name;
        if (!pluginName) throw e;
        if (pluginNameMap[pluginName]) throw new Error("pluginName[" + pluginName + "] duplicate");
        pluginNameMap[pluginName] = 1;
      } else {
        throw new Error('a plugin must export install handler!');
      }
    });
    _ccContext["default"].pluginNameMap = pluginNameMap;
  }
}

var _default = {
  configStoreState: configStoreState,
  configRootReducer: configRootReducer,
  configRootComputed: configRootComputed,
  configRootWatch: configRootWatch,
  configRootLifecycle: configRootLifecycle,
  configMiddlewares: configMiddlewares,
  configPlugins: configPlugins
};
exports["default"] = _default;
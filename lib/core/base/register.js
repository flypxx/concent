"use strict";

var _interopRequireWildcard = require("@babel/runtime/helpers/interopRequireWildcard");

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

exports.__esModule = true;
exports["default"] = register;

var _extends2 = _interopRequireDefault(require("@babel/runtime/helpers/extends"));

var _assertThisInitialized2 = _interopRequireDefault(require("@babel/runtime/helpers/assertThisInitialized"));

var _inheritsLoose2 = _interopRequireDefault(require("@babel/runtime/helpers/inheritsLoose"));

var React = _interopRequireWildcard(require("react"));

var _constant = require("../../support/constant");

var util = _interopRequireWildcard(require("../../support/util"));

var _catchCcError = _interopRequireDefault(require("./catch-cc-error"));

var hf = _interopRequireWildcard(require("../state/handler-factory"));

var _mapRegistrationInfo2 = _interopRequireDefault(require("./map-registration-info"));

var _buildRefCtx = _interopRequireDefault(require("../ref/build-ref-ctx"));

var _beforeMount = _interopRequireDefault(require("./before-mount"));

var _didMount = _interopRequireDefault(require("./did-mount"));

var _didUpdate = _interopRequireDefault(require("./did-update"));

var _beforeUnmount = _interopRequireDefault(require("./before-unmount"));

var _beforeRender = _interopRequireDefault(require("../ref/before-render"));

// import hoistNonReactStatic from 'hoist-non-react-statics';
var ccClassDisplayName = util.ccClassDisplayName,
    shallowDiffers = util.shallowDiffers,
    evalState = util.evalState;

var setupErr = function setupErr(info) {
  return new Error('can not defined setup both in register options and class body ' + '--verbose:' + info);
};

function register(_temp, ccClassKey) {
  var _ref = _temp === void 0 ? {} : _temp,
      _ref$module = _ref.module,
      module = _ref$module === void 0 ? _constant.MODULE_DEFAULT : _ref$module,
      _ref$state = _ref.state,
      state = _ref$state === void 0 ? {} : _ref$state,
      _ref$watchedKeys = _ref.watchedKeys,
      watchedKeys = _ref$watchedKeys === void 0 ? '-' : _ref$watchedKeys,
      _ref$storedKeys = _ref.storedKeys,
      storedKeys = _ref$storedKeys === void 0 ? [] : _ref$storedKeys,
      _ref$setup = _ref.setup,
      setup = _ref$setup === void 0 ? null : _ref$setup,
      persistStoredKeys = _ref.persistStoredKeys,
      _ref$connect = _ref.connect,
      connect = _ref$connect === void 0 ? {} : _ref$connect,
      _ref$extra = _ref.extra,
      extra = _ref$extra === void 0 ? {} : _ref$extra,
      tag = _ref.tag,
      lite = _ref.lite,
      _ref$isPropsProxy = _ref.isPropsProxy,
      isPropsProxy = _ref$isPropsProxy === void 0 ? false : _ref$isPropsProxy,
      renderKeyClasses = _ref.renderKeyClasses,
      _ref$__checkStartUp = _ref.__checkStartUp,
      __checkStartUp = _ref$__checkStartUp === void 0 ? true : _ref$__checkStartUp,
      _ref$compareProps = _ref.compareProps,
      compareProps = _ref$compareProps === void 0 ? true : _ref$compareProps,
      __calledBy = _ref.__calledBy;

  if (ccClassKey === void 0) {
    ccClassKey = '';
  }

  try {
    var _mapRegistrationInfo = (0, _mapRegistrationInfo2["default"])(module, ccClassKey, renderKeyClasses, _constant.CC_CLASS, watchedKeys, connect, __checkStartUp, __calledBy),
        _module = _mapRegistrationInfo._module,
        _ccClassKey = _mapRegistrationInfo._ccClassKey,
        _connect = _mapRegistrationInfo._connect,
        _watchedKeys = _mapRegistrationInfo._watchedKeys;

    return function (ReactClass) {
      if (ReactClass.prototype && ReactClass.prototype.$$attach) {
        throw new Error("register a cc class is prohibited!");
      } // const isClsPureComponent = ReactClass.prototype.isPureReactComponent;


      var ToBeExtendedClass = isPropsProxy === false ? ReactClass : React.Component;
      var staticSetup = ToBeExtendedClass.$$setup;

      var _CcClass =
      /*#__PURE__*/
      function (_ToBeExtendedClass) {
        (0, _inheritsLoose2["default"])(CcClass, _ToBeExtendedClass);

        function CcClass(props, context) {
          var _this;

          _this = _ToBeExtendedClass.call(this, props, context) || this;

          try {
            var optState = evalState(state);
            var thisState = _this.state || {};
            var privState = Object.assign(thisState, optState);
            _this.$$attach = _this.$$attach.bind((0, _assertThisInitialized2["default"])(_this)); // props.ccOption

            var params = Object.assign({}, props, {
              module: _module,
              tag: tag,
              state: privState,
              type: _constant.CC_CLASS,
              insType: _constant.CC_CUSTOMIZE,
              watchedKeys: _watchedKeys,
              ccClassKey: _ccClassKey,
              connect: _connect,
              storedKeys: storedKeys,
              persistStoredKeys: persistStoredKeys,
              extra: extra
            });
            (0, _buildRefCtx["default"])((0, _assertThisInitialized2["default"])(_this), params, lite);
            _this.ctx.reactSetState = hf.makeRefSetState((0, _assertThisInitialized2["default"])(_this));
            _this.ctx.reactForceUpdate = hf.makeRefForceUpdate((0, _assertThisInitialized2["default"])(_this));

            if (setup && (_this.$$setup || staticSetup)) {
              throw setupErr('ccUniqueKey ' + _this.ctx.ccUniqueKey);
            }

            if (!isPropsProxy) {
              if (_this.$$setup) _this.$$setup = _this.$$setup.bind((0, _assertThisInitialized2["default"])(_this));
              (0, _beforeMount["default"])((0, _assertThisInitialized2["default"])(_this), setup || _this.$$setup || staticSetup, false);
            } // isPropsProxy为true时，延迟到$$attach里执行beforeMount

          } catch (err) {
            (0, _catchCcError["default"])(err);
          }

          return _this;
        } // 如果代理组件或者继承组件没有没有实现scu，则同时比较nextState nextProps
        // 因为nextProps不同也会导致重渲染，所以需要约束用户不要把可变数据从props传下来，以提高性能


        var _proto = CcClass.prototype;

        _proto.shouldComponentUpdate = function shouldComponentUpdate(nextProps, nextState) {
          var childRef = this.ctx.childRef;

          if (childRef && childRef.shouldComponentUpdate) {
            return childRef.shouldComponentUpdate(nextProps, nextState);
          } else if (_ToBeExtendedClass.prototype.shouldComponentUpdate) {
            return _ToBeExtendedClass.prototype.shouldComponentUpdate.call(this, nextProps, nextState);
          }

          var isPropsChanged = compareProps ? shallowDiffers(this.props, nextProps) : false;
          return this.state !== nextState || isPropsChanged;
        } //!!! 存在多重装饰器时, 或者用户想使用this.props.***来用concent类时
        //!!! 必需在类的【constructor】 里调用 this.props.$$attach(this),紧接着state定义之后
        ;

        _proto.$$attach = function $$attach(childRef) {
          var ctx = this.ctx;
          ctx.childRef = childRef;
          childRef.ctx = ctx; // 让代理属性的目标组件访问ctx时，既可以写 this.props.ctx 也可以写 this.ctx
          // 让孩子引用的setState forceUpdate 指向父容器事先构造好的setState forceUpdate

          childRef.setState = ctx.setState;
          childRef.forceUpdate = ctx.forceUpdate;

          if (util.isObjectNotNull(childRef.state)) {
            Object.assign(ctx.state, childRef.state, ctx.__$$mstate);
          }

          if (childRef.$$setup) childRef.$$setup = childRef.$$setup.bind(childRef);
          if (setup && (childRef.$$setup || staticSetup)) throw setupErr('ccUniqueKey ' + ctx.ccUniqueKey);
          (0, _beforeMount["default"])(this, setup || childRef.$$setup || staticSetup, false);
          (0, _beforeRender["default"])(this);
        };

        _proto.componentDidMount = function componentDidMount() {
          // 属性代理模式，必需在组件consturctor里调用 props.$$attach(this)
          // you must call it in next line of state assign expression 
          if (isPropsProxy && !this.ctx.childRef) {
            throw new Error("forget call props.$$attach(this) in consturctor when set isPropsProxy true");
          }

          if (_ToBeExtendedClass.prototype.componentDidMount) _ToBeExtendedClass.prototype.componentDidMount.call(this);
          (0, _didMount["default"])(this);
        };

        _proto.componentDidUpdate = function componentDidUpdate(prevProps, prevState, snapshot) {
          if (_ToBeExtendedClass.prototype.componentDidUpdate) _ToBeExtendedClass.prototype.componentDidUpdate.call(this, prevProps, prevState, snapshot);
          (0, _didUpdate["default"])(this);
        };

        _proto.componentWillUnmount = function componentWillUnmount() {
          if (_ToBeExtendedClass.prototype.componentWillUnmount) _ToBeExtendedClass.prototype.componentWillUnmount.call(this);
          (0, _beforeUnmount["default"])(this);
        } // 注：strict mode 模式下，class组件的双调用机制行为和function组件不一样
        // constructor x2 ---> render x2 ---> componentDidMount x1
        // 两次构造器里虽然生成了不同的refCtx，但是两次render里给的 this.ctx 始终是最新的那一个
        // 所以此处不需要像 useConcent 一样做ef标记
        ;

        _proto.render = function render() {
          var outProps = this.props;
          this.ctx.prevProps = this.ctx.props;
          this.ctx.props = outProps;
          (0, _beforeRender["default"])(this);

          if (isPropsProxy === false) {
            // now cc class extends ReactClass, call super.render()
            return _ToBeExtendedClass.prototype.render.call(this);
          } else {
            //将$$attach传递下去，用户需在构造器里最后一样调用props.$$attach()
            var passedProps = (0, _extends2["default"])({}, outProps, {
              ctx: this.ctx,
              $$attach: this.$$attach
            });
            return React.createElement(ReactClass, passedProps);
          }
        };

        return CcClass;
      }(ToBeExtendedClass);

      _CcClass.displayName = ccClassDisplayName(_ccClassKey);
      return _CcClass;
    };
  } catch (err) {
    (0, _catchCcError["default"])(err);
  }
}
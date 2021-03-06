'use strict';

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var React = require('react');
var ReactDOM = require('react-dom');
var createReactClass = require('create-react-class');
var PropTypes = require('prop-types');
var classNames = require('classnames');
var ClassNameMixin = require('./mixins/ClassNameMixin');
var DimmerMixin = require('./mixins/DimmerMixin');
var Events = require('./utils/Events');
var Close = require('./Close');
var Icon = require('./Icon');

var Modal = createReactClass({
  mixins: [ClassNameMixin, DimmerMixin],

  propTypes: {
    classprefix: PropTypes.string.isRequired,
    type: PropTypes.oneOf(['alert', 'confirm', 'prompt', 'loading', 'actions', 'popup']),
    title: PropTypes.node,
    confirmText: PropTypes.string,
    cancelText: PropTypes.string,
    closeIcon: PropTypes.bool,
    closeViaDimmer: PropTypes.bool,
    onRequestClose: PropTypes.func,
    modalWidth: PropTypes.string
  },

  getDefaultProps: function getDefaultProps() {
    return {
      classprefix: 'modal',
      closeIcon: true,
      confirmText: '确定',
      cancelText: '取消',
      onRequestClose: function onRequestClose() {}
    };
  },

  getInitialState: function getInitialState() {
    return {
      transitioning: false
    };
  },

  componentDidMount: function componentDidMount() {
    this._documentKeyupListener = Events.on(document, 'keyup', this.handleDocumentKeyUp, false);

    this.setDimmerContainer();

    // TODO: 何为添加动画效果的最佳时机？ render 完成以后添加动画 Class？
    this.setState({
      transitioning: true
    });
  },

  componentWillUnmount: function componentWillUnmount() {
    this._documentKeyupListener.off();
    this.resetDimmerContainer();
  },

  handleDimmerClick: function handleDimmerClick() {
    if (this.props.closeViaDimmer) {
      this.props.onRequestClose();
    }
  },

  handleBackdropClick: function handleBackdropClick(e) {
    if (e.target !== e.currentTarget) {
      return;
    }

    this.props.onRequestClose();
  },

  handleDocumentKeyUp: function handleDocumentKeyUp(e) {
    if (!this.props.keyboard && e.keyCode === 27) {
      this.props.onRequestClose();
      //当调用时，用show属性控制modal时，需要在这里reset show属性，escCallback 和 onCancel 是一样的
      this.props.escCallback && this.props.escCallback();
    }
  },

  isPopup: function isPopup() {
    return this.props.type === 'popup';
  },

  isActions: function isActions() {
    return this.props.type === 'actions';
  },

  // Get input data for prompt modal
  getPromptData: function getPromptData() {
    var data = [],
        dom = ReactDOM.findDOMNode(this),
        inputs = dom.querySelectorAll('input'),
        textarea = dom.querySelectorAll('textarea');

    function getData(arr, data) {
      if (arr) {
        var i = 0;

        for (; i < arr.length; i++) {
          data.push(arr[i].value);
        }
      }
    }

    getData(inputs, data);
    getData(textarea, data);

    return data.length === 0 ? null : data.length === 1 ? data[0] : data;
  },

  handleConfirm: function handleConfirm(e) {
    var data = e;

    if (this.props.type === 'prompt' || this.props.type === 'confirm') {
      data = this.getPromptData();
    }

    this.props.onConfirm(data);
  },

  renderActions: function renderActions() {
    return React.createElement(
      'div',
      {
        style: { display: 'block' },
        className: classNames(this.props.className, this.setClassNamespace('modal-actions'), this.setClassNamespace('modal-active'))
      },
      this.props.children
    );
  },

  renderPopup: function renderPopup() {
    var _this = this;

    return React.createElement(
      'div',
      {
        style: { display: 'block' },
        className: classNames(this.props.className, this.setClassNamespace('popup'), this.setClassNamespace('modal-active'))
      },
      React.createElement(
        'div',
        { className: this.setClassNamespace('popup-inner') },
        React.createElement(
          'div',
          { className: this.setClassNamespace('popup-hd') },
          this.props.title ? React.createElement(
            'h4',
            { className: this.setClassNamespace('popup-title') },
            this.props.title
          ) : null,
          React.createElement(Close, { onClick: function onClick() {
              console.log('close popover');_this.props.onRequestClose();
            } })
        ),
        React.createElement(
          'div',
          { className: this.setClassNamespace('popup-bd') },
          this.props.children
        )
      )
    );
  },

  renderHeader: function renderHeader() {
    var title = this.props.title;
    var closeIcon = this.props.closeIcon && !this.props.type ? React.createElement(Close, {
      onClick: this.props.onRequestClose
    }) : null;

    return this.props.title || closeIcon ? React.createElement(
      'div',
      { className: this.prefixClass('hd') },
      title ? React.createElement(
        'h4',
        {
          className: this.setClassNamespace('margin-bottom-sm') + ' modal-header'
        },
        title
      ) : null,
      closeIcon
    ) : null;
  },

  // Render alert/confirm/prompt buttons
  renderFooter: function renderFooter() {
    var buttons;
    var btnClass = this.prefixClass('btn');
    var props = this.props;

    switch (this.props.type) {
      case 'alert':
        buttons = React.createElement(
          'span',
          {
            onClick: this.props.onConfirm,
            className: btnClass
          },
          this.props.confirmText
        );
        break;
      case 'confirm':
      case 'prompt':
        buttons = [props.cancelText, props.confirmText].map(function (text, i) {
          return React.createElement(
            'span',
            {
              key: i,
              onClick: i === 0 ? this.props.onCancel : this.handleConfirm,
              className: btnClass
            },
            text
          );
        }.bind(this));
        break;
      default:
        buttons = null;
    }

    return buttons ? React.createElement(
      'div',
      { className: this.prefixClass('footer') },
      buttons
    ) : null;
  },

  render: function render() {
    if (this.isActions()) {
      return this.renderDimmer(this.renderActions());
    }

    if (this.isPopup()) {
      return this.renderDimmer(this.renderPopup());
    }

    var classSet = this.getClassSet();
    var props = this.props;
    var footer = this.renderFooter();
    var style = {
      display: 'block'
    };
    var dialogDimension = {
      width: props.modalWidth,
      height: props.modalHeight
    };

    classSet[this.prefixClass('active')] = this.state.transitioning;

    // .am-modal-no-btn -> refactor this style using `~` selector
    classSet[this.prefixClass('no-btn')] = !footer;
    props.type && (classSet[this.prefixClass(props.type)] = true);

    var modal = React.createElement(
      'div',
      _extends({}, props, {
        style: style,
        ref: 'modal',
        title: null,
        className: classNames(classSet, props.className)
      }),
      React.createElement(
        'div',
        {
          className: this.prefixClass('dialog'),
          style: dialogDimension
        },
        this.renderHeader(),
        React.createElement(
          'div',
          {
            className: this.prefixClass('bd'),
            ref: 'modalBody'
          },
          props.type === 'loading' ? props.children ? props.children : React.createElement(Icon, { icon: 'spinner', spin: true }) : props.children
        ),
        footer
      )
    );

    return this.renderDimmer(modal);
  }
});

module.exports = Modal;

// TODO: Modal 动画效果实现
// -> 如何关闭 Loading Modal?
// -> 关闭 Modal 以后窗口滚动会原来滚动条所在位置
'use strict';

var React = require('react');
var PropTypes = require('prop-types');
var cloneElement = React.cloneElement;
var createReactClass = require('create-react-class');
var OverlayMixin = require('./mixins/OverlayMixin');
var DimmerMixin = require('./mixins/DimmerMixin');
var createChainedFunction = require('./utils/createChainedFunction');

var ModalTrigger = createReactClass({
  mixins: [OverlayMixin, DimmerMixin],

  propTypes: {
    modal: PropTypes.node.isRequired,
    onConfirm: PropTypes.func,
    onCancel: PropTypes.func,
    title: PropTypes.string,
    show: PropTypes.bool,
    onClose: PropTypes.func
  },

  getInitialState: function getInitialState() {
    return {
      isModalActive: false,
      modalWidth: null,
      modalMarginLeft: null,
      modalHeight: null,
      modalMarginTop: null
    };
  },

  componentDidMount: function componentDidMount() {
    if (this.props.show) {
      this.open();
    }
  },

  componentWillReceiveProps: function componentWillReceiveProps(nextProps) {
    if (nextProps.show !== this.props.show) {
      nextProps.show ? this.open() : this.close();
    }
  },

  open: function open() {
    this.setState({
      isModalActive: true
    }, this.setModalStyle);
  },

  close: function close() {
    this.setState({
      isModalActive: false
    });

    if (this.props.onClose) {
      this.props.onClose();
    }
  },

  toggle: function toggle(event) {
    event.stopPropagation();

    if (this.state.isModalActive) {
      this.close();
    } else {
      this.open();
    }
  },

  setModalStyle: function setModalStyle() {
    if (!this.isMounted()) {
      return;
    }

    // TODO: selector
    var modal = this.getOverlayDOMNode().querySelector('.am-modal');

    if (!modal) {
      return;
    }

    var style = {};

    if (this.props.modalHeight) {
      style.modalHeight = this.props.modalHeight;
      // @since 1.1.0, requires Amaze UI 2.6.0+
      // style.modalMarginTop = -this.props.height / 2;
    }
    /*
    else {
      style.modalMarginTop = -modal.offsetHeight / 2;
    }
    */

    if (this.props.modalWidth) {
      style.modalWidth = this.props.modalWidth;
      // style.modalMarginLeft = -this.props.modalWidth / 2;
    }

    this.setState(style);
  },

  // overlay is the modal
  renderOverlay: function renderOverlay() {
    if (!this.state.isModalActive) {
      return React.createElement('span', null);
    }

    return cloneElement(this.props.modal, {
      onRequestClose: this.close,
      marginTop: this.state.modalMarginTop,
      marginLeft: this.state.modalMarginLeft,
      modalWidth: this.state.modalWidth,
      modalHeight: this.state.modalHeight,
      title: this.props.modal.props.title || this.props.title,
      onConfirm: createChainedFunction(this.props.onConfirm, this.close),
      onCancel: createChainedFunction(this.props.onCancel, this.close)
    });
  },

  render: function render() {
    // if "show" is defined, use "show" to control the modal
    if (typeof this.props.show !== 'undefined') {
      return React.createElement(
        'div',
        { className: this.props.className },
        ' ',
        this.props.children,
        ' '
      );
    }

    var child = React.Children.only(this.props.children);
    var props = {};

    props.onClick = createChainedFunction(child.props.onClick, this.toggle);
    props.onMouseOver = createChainedFunction(child.props.onMouseOver, this.props.onMouseOver);
    props.onMouseOut = createChainedFunction(child.props.onMouseOut, this.props.onMouseOut);
    props.onFocus = createChainedFunction(child.props.onFocus, this.props.onFocus);
    props.onBlur = createChainedFunction(child.props.onBlur, this.props.onBlur);

    return cloneElement(child, props);
  }
});

module.exports = ModalTrigger;
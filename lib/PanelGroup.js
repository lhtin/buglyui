'use strict';

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var React = require('react');
var createReactClass = require('create-react-class');
var PropTypes = require('prop-types');
var classNames = require('classnames');
var ClassNameMixin = require('./mixins/ClassNameMixin');

var PanelGroup = createReactClass({
  mixins: [ClassNameMixin],

  propTypes: {
    amstyle: PropTypes.string,
    activeKey: PropTypes.any,
    defaultActiveKey: PropTypes.any,
    onSelect: PropTypes.func,
    accordion: PropTypes.bool
  },

  getDefaultProps: function getDefaultProps() {
    return {
      classprefix: 'panel-group'
    };
  },

  getInitialState: function getInitialState() {
    return {
      activeKey: this.props.defaultActiveKey
    };
  },

  shouldComponentUpdate: function shouldComponentUpdate() {
    // Defer any updates to this component during the `onSelect` handler.
    return !this._isChanging;
  },

  handleSelect: function handleSelect(e, key) {
    e.preventDefault();

    if (this.props.onSelect) {
      this._isChanging = true;
      this.props.onSelect(key);
      this._isChanging = false;
    }

    if (this.state.activeKey === key) {
      key = null;
    }

    this.setState({
      activeKey: key
    });
  },

  renderPanel: function renderPanel(child, index) {
    var activeKey = this.props.activeKey != null ? this.props.activeKey : this.state.activeKey;

    var props = {
      amstyle: child.props.amstyle || this.props.amstyle,
      key: child.key ? child.key : index,
      ref: child.ref
    };

    if (this.props.accordion) {
      props.collapsible = true;
      props.expanded = child.props.eventKey === activeKey;
      props.onSelect = this.handleSelect;
    }

    return React.cloneElement(child, props);
  },

  render: function render() {
    var classes = this.getClassSet();

    return React.createElement(
      'div',
      _extends({}, this.props, {
        className: classNames(classes, this.props.className)
      }),
      React.Children.map(this.props.children, this.renderPanel)
    );
  }
});

module.exports = PanelGroup;
'use strict';

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var React = require('react');
var PropTypes = require('prop-types');
var createReactClass = require('create-react-class');
var classNames = require('classnames');
var assign = require('object-assign');
var omit = require('object.omit');
var ClassNameMixin = require('./mixins/ClassNameMixin');

var NavItem = createReactClass({
  mixins: [ClassNameMixin],

  propTypes: {
    active: PropTypes.bool,
    disabled: PropTypes.bool,
    header: PropTypes.bool,
    divider: PropTypes.bool,
    href: PropTypes.any,
    component: PropTypes.any,
    linkComponent: PropTypes.any,
    linkProps: PropTypes.object
  },

  getDefaultProps: function getDefaultProps() {
    return {
      classprefix: 'nav',
      component: 'li'
    };
  },

  render: function render() {
    var classes = this.getClassSet();
    var props = this.props;
    var Component = props.component;

    // del am-nav
    classes[this.setClassNamespace(props.classprefix)] = false;

    // set classes
    classes[this.prefixClass('header')] = props.header;
    classes[this.prefixClass('divider')] = props.divider;

    if (props.href || props.linkComponent) {
      return this.renderAnchor(classes);
    }

    return React.createElement(
      Component,
      _extends({}, props, {
        className: classNames(classes, props.className)
      }),
      this.props.children
    );
  },

  renderAnchor: function renderAnchor(classes) {
    var Component = this.props.component;
    var linkComponent = this.props.linkComponent || 'a';
    var style = {};

    this.props.disabled && (style.pointerEvents = 'none');

    var linkProps = {
      href: this.props.href,
      title: this.props.tilte,
      target: this.props.target,
      style: style
    };

    return React.createElement(
      Component,
      _extends({}, omit(this.props, ['href', 'target', 'title', 'disabled']), {
        className: classNames(classes, this.props.className)
      }),
      React.createElement(linkComponent, assign(linkProps, this.props.linkProps), this.props.children)
    );
  }
});

module.exports = NavItem;

// TODO: DropDown Tab 处理
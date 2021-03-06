'use strict';

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var React = require('react');
var PropTypes = require('prop-types');
var createReactClass = require('create-react-class');
var classNames = require('classnames');
var ClassNameMixin = require('./mixins/ClassNameMixin');

var Badge = createReactClass({
  mixins: [ClassNameMixin],

  propTypes: {
    component: PropTypes.node,
    href: PropTypes.string,
    round: PropTypes.bool,
    radius: PropTypes.bool
  },

  getDefaultProps: function getDefaultProps() {
    return {
      classprefix: 'badge',
      component: 'span'
    };
  },

  renderAnchor: function renderAnchor(classSet) {
    var Component = this.props.component || 'a';
    var href = this.props.href || '#';

    return React.createElement(
      Component,
      _extends({}, this.props, {
        href: href,
        className: classNames(classSet, this.props.className),
        role: 'badge'
      }),
      this.props.children
    );
  },

  render: function render() {
    var classSet = this.getClassSet();
    var Component = this.props.component;
    var renderAnchor = this.props.href;

    if (renderAnchor) {
      return this.renderAnchor(classSet);
    }

    return React.createElement(
      Component,
      _extends({}, this.props, {
        className: classNames(classSet, this.props.className)
      }),
      this.props.children
    );
  }
});

module.exports = Badge;
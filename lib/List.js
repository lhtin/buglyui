'use strict';

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var React = require('react');
var createReactClass = require('create-react-class');
var PropTypes = require('prop-types');
var classNames = require('classnames');
var ClassNameMixin = require('./mixins/ClassNameMixin');

var List = createReactClass({
  mixins: [ClassNameMixin],

  propTypes: {
    bordered: PropTypes.bool,
    striped: PropTypes.bool,
    static: PropTypes.bool,
    component: PropTypes.node.isRequired
  },

  getDefaultProps: function getDefaultProps() {
    return {
      classprefix: 'list',
      component: 'ul'
    };
  },

  render: function render() {
    var classes = this.getClassSet();
    var Component = this.props.component;
    var props = this.props;
    var prefixClass = this.prefixClass;

    // am-list-border
    classes[prefixClass('border')] = props.border || props.bordered;

    // am-list-striped
    classes[prefixClass('striped')] = props.striped;

    // am-list-static
    classes[prefixClass('static')] = props.static;

    return React.createElement(
      Component,
      _extends({}, props, {
        className: classNames(classes, props.className)
      }),
      props.children
    );
  }
});

module.exports = List;
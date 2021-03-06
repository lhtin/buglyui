'use strict';

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var React = require('react');
var createReactClass = require('create-react-class');
var PropTypes = require('prop-types');
var classNames = require('classnames');
var ClassNameMixin = require('./mixins/ClassNameMixin');

var Table = createReactClass({
  mixins: [ClassNameMixin],

  propTypes: {
    classprefix: PropTypes.string.isRequired,
    bordered: PropTypes.bool,
    compact: PropTypes.bool,
    hover: PropTypes.bool,
    striped: PropTypes.bool,
    radius: PropTypes.bool,
    responsive: PropTypes.bool
  },

  getDefaultProps: function getDefaultProps() {
    return {
      classprefix: 'table'
    };
  },

  render: function render() {
    var classSet = this.getClassSet();
    var responsive = this.props.responsive;

    classSet[this.prefixClass('bordered')] = this.props.bordered;
    classSet[this.prefixClass('compact')] = this.props.compact;
    classSet[this.prefixClass('hover')] = this.props.hover;
    classSet[this.prefixClass('striped')] = this.props.striped;
    classSet[this.prefixClass('radius')] = this.props.radius;

    // add `.am-text-nowrap` to responsive table
    classSet[this.setClassNamespace('text-nowrap')] = responsive;

    var table = React.createElement(
      'table',
      _extends({}, this.props, {
        className: classNames(this.props.className, classSet)
      }),
      this.props.children
    );

    return responsive ? React.createElement(
      'div',
      { className: this.setClassNamespace('scrollable-horizontal') },
      table
    ) : table;
  }
});

module.exports = Table;
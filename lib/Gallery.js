'use strict';

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var React = require('react');
var createReactClass = require('create-react-class');
var PropTypes = require('prop-types');
var classNames = require('classnames');
var ClassNameMixin = require('./mixins/ClassNameMixin');
var AvgGrid = require('./AvgGrid');
var omit = require('object.omit');

var Gallery = createReactClass({
  mixins: [ClassNameMixin],

  propTypes: {
    classprefix: PropTypes.string,
    theme: PropTypes.oneOf(['default', 'overlay', 'bordered', 'imgbordered']),
    data: PropTypes.array,
    sm: PropTypes.number,
    md: PropTypes.number,
    lg: PropTypes.number
  },

  getDefaultProps: function getDefaultProps() {
    return {
      classprefix: 'gallery',
      theme: 'default',
      data: []
    };
  },

  renderItem: function renderItem(item) {
    var img = item.img ? React.createElement('img', {
      src: item.img,
      key: 'galeryImg',
      alt: item.alt || item.title || null
    }) : null;
    var title = item.title ? React.createElement(
      'h3',
      {
        key: 'galleryTitle',
        className: this.prefixClass('title')
      },
      item.title
    ) : null;
    var desc = item.desc ? React.createElement(
      'div',
      {
        key: 'galleryDesc',
        className: this.prefixClass('desc')
      },
      item.desc
    ) : null;
    var galleryItem = item.link ? React.createElement(
      'a',
      { href: item.link },
      img,
      title,
      desc
    ) : [img, title, desc];

    return React.createElement(
      'div',
      {
        className: classNames(this.props.className, this.prefixClass('item'))
      },
      galleryItem
    );
  },

  render: function render() {
    var classSet = this.getClassSet();
    var props = omit(this.props, ['classprefix', 'data', 'theme']);

    return React.createElement(
      AvgGrid,
      _extends({}, props, {
        sm: this.props.sm || 2,
        md: this.props.md || 3,
        lg: this.props.lg || 4,
        'data-am-widget': this.props.classprefix,
        className: classNames(this.props.className, classSet)
      }),
      this.props.data.map(function (item, i) {
        return React.createElement(
          'li',
          { key: i },
          this.renderItem(item)
        );
      }.bind(this))
    );
  }
});

module.exports = Gallery;
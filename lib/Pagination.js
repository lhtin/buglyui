'use strict';

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var React = require('react');
var ReactDOM = require('react-dom');
var createReactClass = require('create-react-class');
var PropTypes = require('prop-types');
var classNames = require('classnames');
var assign = require('object-assign');
var omit = require('object.omit');
var ClassNameMixin = require('./mixins/ClassNameMixin');

var Pagination = createReactClass({
  mixins: [ClassNameMixin],

  PropTypes: {
    component: PropTypes.node.isRequired,
    centered: PropTypes.bool,
    right: PropTypes.bool,
    theme: PropTypes.oneOf(['default', 'select']),
    data: PropTypes.object,
    onSelect: PropTypes.func
  },

  getDefaultProps: function getDefaultProps() {
    return {
      classprefix: 'pagination',
      component: 'ul'
    };
  },

  renderItem: function renderItem(type) {
    var data = this.props.data;

    return data && data[type + 'Title'] && data[type + 'Link'] ? React.createElement(
      Pagination.Item,
      {
        onClick: this.props.onSelect && this.props.onSelect.bind(this, data[type + 'Link']),
        key: type,
        href: data[type + 'Link'],
        className: this.prefixClass(type)
      },
      data[type + 'Title']
    ) : null;
  },

  handleChange: function handleChange(e) {
    if (this.props.onSelect) {
      var select = ReactDOM.findDOMNode(this.refs.select);

      this.props.onSelect.call(this, select && select.value, e);
    }
  },

  renderPages: function renderPages() {
    var data = this.props.data;

    if (data.pages) {
      return this.props.theme === 'select' ? React.createElement(
        'li',
        { className: this.prefixClass('select') },
        React.createElement(
          'select',
          {
            onChange: this.handleChange,
            ref: 'select'
          },
          data.pages.map(function (page, i) {
            return React.createElement(
              'option',
              { value: page.link, key: i },
              page.title,
              ' / ',
              data.pages.length
            );
          })
        )
      ) : data.pages.map(function (page, i) {
        return React.createElement(
          Pagination.Item,
          {
            key: i,
            onClick: this.props.onSelect && this.props.onSelect.bind(this, page.link),
            active: page.active,
            disabled: page.disabled,
            href: page.link
          },
          page.title
        );
      }.bind(this));
    }
  },

  render: function render() {
    var props = this.props;
    var Component = props.component;
    var classSet = this.getClassSet();
    var notSelect = props.theme !== 'select';

    // .am-pagination-right
    classSet[this.prefixClass('right')] = props.right;

    // .am-pagination-centered
    classSet[this.prefixClass('centered')] = props.centered;

    return props.data ? React.createElement(
      Component,
      _extends({}, props, {
        className: classNames(classSet, props.className)
      }),
      notSelect && this.renderItem('first'),
      this.renderItem('prev'),
      this.renderPages(),
      this.renderItem('next'),
      notSelect && this.renderItem('last')
    ) : React.createElement(
      Component,
      _extends({}, props, {
        className: classNames(classSet, props.className)
      }),
      this.props.children
    );
  }
});

Pagination.Item = createReactClass({
  mixins: [ClassNameMixin],

  propTypes: {
    active: PropTypes.bool,
    disabled: PropTypes.bool,
    prev: PropTypes.bool,
    next: PropTypes.bool,
    href: PropTypes.string,
    component: PropTypes.any,
    linkComponent: PropTypes.any,
    linkProps: PropTypes.object
  },

  getDefaultProps: function getDefaultProps() {
    return {
      classprefix: 'pagination',
      component: 'li'
    };
  },

  render: function render() {
    var Component = this.props.component;
    var classSet = this.getClassSet(true);
    var props = this.props;
    var linkComponent = this.props.linkComponent || (this.props.href ? 'a' : null);

    // .am-pagination-prev
    classSet[this.prefixClass('prev')] = props.prev;

    // .am-pagination-next
    classSet[this.prefixClass('next')] = props.next;

    return React.createElement(
      Component,
      _extends({}, omit(this.props, ['href', 'title', 'target']), {
        className: classNames(classSet, this.props.className)
      }),
      linkComponent ? React.createElement(linkComponent, assign({
        href: this.props.href,
        title: this.props.title,
        target: this.props.target,
        ref: 'anchor'
      }, this.props.linkProps), this.props.children) : this.props.children
    );
  }
});

module.exports = Pagination;
'use strict';

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var React = require('react');
var createReactClass = require('create-react-class');
var PropTypes = require('prop-types');
var classNames = require('classnames');
var assign = require('object-assign');
var ClassNameMixin = require('./mixins/ClassNameMixin');
var createChainedFunction = require('./utils/createChainedFunction');
var Icon = require('./Icon');
var Button = require('./Button');

var Topbar = createReactClass({
  mixins: [ClassNameMixin],

  propTypes: {
    component: PropTypes.node,
    brand: PropTypes.node,
    brandLink: PropTypes.string,
    inverse: PropTypes.bool,
    fixedTop: PropTypes.bool,
    fixedBottom: PropTypes.bool,
    toggleBtn: PropTypes.node,
    toggleNavKey: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    onToggle: PropTypes.func,
    navExpanded: PropTypes.bool,
    defaultNavExpanded: PropTypes.bool,
    fluid: PropTypes.bool
  },

  getDefaultProps: function getDefaultProps() {
    return {
      classprefix: 'topbar',
      component: 'header'
    };
  },

  getInitialState: function getInitialState() {
    return {
      navExpanded: this.props.defaultNavExpanded
    };
  },

  shouldComponentUpdate: function shouldComponentUpdate() {
    // Defer any updates to this component during the `onSelect` handler.
    return !this._isChanging;
  },

  handleToggle: function handleToggle() {
    if (this.props.onToggle) {
      this._isChanging = true;
      this.props.onToggle();
      this._isChanging = false;
    }

    this.setState({
      navExpanded: !this.state.navExpanded
    });
  },

  isNavExpanded: function isNavExpanded() {
    return this.props.navExpanded != null ? this.props.navExpanded : this.state.navExpanded;
  },

  renderBrand: function renderBrand() {
    var brand = this.props.brand;
    var brandClassName = this.prefixClass('brand');

    if (React.isValidElement(brand)) {
      return React.cloneElement(brand, assign({}, brand.props, {
        className: classNames(brand.props.className, brandClassName),
        onClick: createChainedFunction(this.handleToggle, brand.props.onClick)
      }));
    }

    return brand ? React.createElement(
      'h1',
      { className: brandClassName },
      this.props.brandLink ? React.createElement(
        'a',
        { href: this.props.brandLink },
        this.props.brand
      ) : this.props.brand
    ) : null;
  },

  renderToggleButton: function renderToggleButton() {
    var toggleBtn = this.props.toggleBtn;
    var toggleBtnClassName = this.prefixClass('toggle');

    if (React.isValidElement(toggleBtn)) {
      return React.cloneElement(toggleBtn, assign({}, toggleBtn.props, {
        className: classNames(toggleBtn.props.className, toggleBtnClassName),
        onClick: createChainedFunction(this.handleToggle, toggleBtn.props.onClick)
      }));
    }

    return React.createElement(
      Button,
      {
        amsize: 'sm',
        onClick: this.handleToggle,
        className: classNames(this.prefixClass('btn'), this.prefixClass('toggle'), this.setClassNamespace('show-sm-only'))
      },
      React.createElement(
        'span',
        { className: this.setClassNamespace('sr-only') },
        '\u5BFC\u822A\u5207\u6362'
      ),
      React.createElement(Icon, { icon: 'bars' })
    );
  },

  renderChild: function renderChild(child, i) {
    return React.cloneElement(child, assign({}, child.props, {
      topbar: true,
      collapsible: this.props.toggleNavKey != null && this.props.toggleNavKey === child.props.eventKey,
      expanded: this.props.toggleNavKey != null && this.props.toggleNavKey === child.props.eventKey && this.isNavExpanded(),
      key: child.key ? child.key : i,
      className: classNames(child.props.className, child.props.right ? this.prefixClass('right') : null)
    }));
  },

  render: function render() {
    var classes = this.getClassSet();
    var Component = this.props.component;

    // set classes
    classes[this.prefixClass('inverse')] = this.props.inverse;
    classes[this.prefixClass('fixed-top')] = this.props.fixedTop;
    classes[this.prefixClass('fixed-bottom')] = this.props.fixedBottom;

    return React.createElement(
      Component,
      _extends({}, this.props, {
        className: classNames(classes, this.props.className)
      }),
      React.createElement(
        'div',
        {
          className: !this.props.fluid ? this.setClassNamespace('container') : null
        },
        this.renderBrand(),
        this.renderToggleButton(),
        React.Children.map(this.props.children, this.renderChild)
      )
    );
  }
});

module.exports = Topbar;
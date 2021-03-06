'use strict';

var React = require('react');
var ReactDOM = require('react-dom');
var createReactClass = require('create-react-class');
var PropTypes = require('prop-types');
var cloneElement = React.cloneElement;
var assign = require('object-assign');
var classNames = require('classnames');
var SmoothScrollMixin = require('./mixins/SmoothScrollMixin');
var isInViewport = require('./utils/isInViewport');
var Events = require('./utils/Events');
var requestAnimationFrame = require('./utils/requestAnimationFrame');
var debounce = require('./utils/debounce');
var CSSCore = require('./utils/CSSCore');
var domUtils = require('./utils/domUtils');
var createChainedFunction = require('./utils/createChainedFunction');
var canUseDOM = require('./utils/canUseDOM');
var constants = require('./constants');

var ScrollSpyNav = createReactClass({
  mixins: [SmoothScrollMixin],

  propTypes: {
    activeClass: PropTypes.string,
    offsetTop: PropTypes.number,
    container: PropTypes.any
  },

  getDefaultProps: function getDefaultProps() {
    return {
      activeClass: constants.CLASSES.active
    };
  },

  componentDidMount: function componentDidMount() {
    if (canUseDOM) {
      this._init();
      this.checkRAF();

      var debounced = debounce(this.checkRAF, 100).bind(this);

      this._scrollListener = Events.on(window, 'scroll', this.checkRAF);
      this._resizeListener = Events.on(window, 'resize', debounced);
      this._orientationListener = Events.on(window, 'orientationchange', debounced);
    }
  },

  componentWillUnmount: function componentWillUnmount() {
    this._scrollListener && this._scrollListener.off();
    this._resizeListener && this._resizeListener.off();
    this._orientationListener && this._orientationListener.off();
  },

  _init: function _init() {
    this._linkNodes = ReactDOM.findDOMNode(this).querySelectorAll('a[href^="#"]');
    this._anchorNodes = [];

    Array.prototype.forEach.call(this._linkNodes, function (link) {
      var anchor = document.getElementById(link.getAttribute('href').substr(1));

      if (anchor) {
        this._anchorNodes.push(anchor);
      }
    }.bind(this));
  },

  checkIsInView: function checkIsInView() {
    if (this.isMounted()) {
      var inViewsNodes = [];

      this._anchorNodes.forEach(function (anchor) {
        if (isInViewport(anchor)) {
          inViewsNodes.push(anchor);
        }
      });

      if (inViewsNodes.length) {
        var targetNode;

        inViewsNodes.every(function (node) {
          if (domUtils.offset(node).top >= domUtils.scrollTop(window)) {
            targetNode = node;
            return false; // break loop
          }
          return true;
        });

        if (!targetNode) {
          return;
        }

        Array.prototype.forEach.call(this._linkNodes, function (link) {
          CSSCore.removeClass(link, this.props.activeClass);
        }.bind(this));

        var targetLink = ReactDOM.findDOMNode(this).querySelector('a[href="#' + targetNode.id + '"]');

        targetLink && CSSCore.addClass(targetLink, this.props.activeClass);
      }
    }
  },

  checkRAF: function checkRAF() {
    requestAnimationFrame(this.checkIsInView);
  },

  // Smooth scroll
  handleClick: function handleClick(e) {
    e.preventDefault();

    if (e.target && e.target.nodeName === 'A') {
      var targetNode = document.getElementById(e.target.getAttribute('href').substr(1));

      // TODO: set scroll element if `container` prop set
      targetNode && this.smoothScroll(window, {
        position: domUtils.offset(targetNode).top - this.props.offsetTop || 0
      });
    }
  },

  render: function render() {
    var child = React.Children.only(this.props.children);

    // transfer child's props to cloned element
    return cloneElement(child, assign({}, this.props, child.props, {
      onClick: createChainedFunction(this.handleClick, child.props.onClick),
      className: classNames(this.props.className, child.props.className)
    }));
  }
});

module.exports = ScrollSpyNav;

// TODO: improve in view logic
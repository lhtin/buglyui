'use strict';

var React = require('react');
var createReactClass = require('create-react-class');
var PropTypes = require('prop-types');
var classNames = require('classnames');
var ClassNameMixin = require('./mixins/ClassNameMixin');

var Progress = createReactClass({
  mixins: [ClassNameMixin],

  propTypes: {
    now: PropTypes.number,
    label: PropTypes.string,
    active: PropTypes.bool,
    striped: PropTypes.bool,
    amsize: PropTypes.string,
    amstyle: PropTypes.string
  },

  getDefaultProps: function() {
    return {
      classprefix: 'progress'
    };
  },

  renderProgressBar: function() {
    var styleSheet = {
      width: this.props.now + '%'
    };
    var classes = {};
    var prefix = this.prefixClass('bar');
    var amstyle = this.props.amstyle;

    // set am-progress-bar
    classes[prefix] = true;

    if (amstyle) {
      classes[prefix + '-' + amstyle] = true;
    }

    return (
      <div
        className={classNames(classes)}
        style={styleSheet}
        role="progressbar"
      >
        {this.props.label}
      </div>
    );
  },

  renderChildBar: function(child, index) {
    return React.cloneElement(child, {
      isChild: true,
      key: child.key ? child.key : index
    });
  },

  render: function() {
    var classes = this.getClassSet();

    // set class
    classes[this.prefixClass('striped')] = this.props.striped;

    if (this.props.active) {
      classes[this.prefixClass('striped')] = true;
    }

    if (!this.props.children) {
      if (!this.props.isChild) {
        return (
          <div
            {...this.props}
            className={classNames(classes, this.props.className)}
          >
            {this.renderProgressBar()}
          </div>
        );
      } else {
        return (
          this.renderProgressBar()
        );
      }
    } else {
      return (
        <div
          {...this.props}
          className={classNames(classes, this.props.className)}
        >
          {React.Children.map(this.props.children, this.renderChildBar)}
        </div>
      );
    }
  }
});

module.exports = Progress;

// Todo: 删除无用 class
//     : key ref 处理问题

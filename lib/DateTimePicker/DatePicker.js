'use strict';

var React = require('react');
var createReactClass = require('create-react-class');
var PropTypes = require('prop-types');
var classNames = require('classnames');
var fecha = require('fecha');
var ClassNameMixin = require('../mixins/ClassNameMixin');
var dateUtils = require('../utils/dateUtils');

var DatePicker = createReactClass({
  mixins: [ClassNameMixin],

  propTypes: {
    onSelect: PropTypes.func.isRequired,
    onClose: PropTypes.func,
    viewMode: PropTypes.string,
    minViewMode: PropTypes.string,
    daysOfWeekDisabled: PropTypes.array,
    format: PropTypes.string,
    date: PropTypes.object,
    weekStart: PropTypes.number,
    minDate: PropTypes.string,
    maxDate: PropTypes.string,
    locale: PropTypes.string
  },

  getDefaultProps: function getDefaultProps() {
    return {
      classprefix: 'datepicker',
      date: new Date(),
      daysOfWeekDisabled: [],
      viewMode: 'days',
      minViewMode: 'days',
      format: 'YYYY-MM-DD',
      displayed: {
        days: { display: 'block' },
        months: { display: 'none' },
        years: { display: 'none' }
      }
    };
  },

  getInitialState: function getInitialState() {
    var displayed;

    switch (this.props.viewMode) {
      case 'days':
        displayed = {
          days: { display: 'block' },
          months: { display: 'none' },
          years: { display: 'none' }
        };
        break;

      case 'months':
        displayed = {
          days: { display: 'none' },
          months: { display: 'block' },
          years: { display: 'none' }
        };
        break;

      case 'years':
        displayed = {
          days: { display: 'none' },
          months: { display: 'none' },
          years: { display: 'block' }
        };
        break;
    }

    return {
      locale: dateUtils.getLocale(this.props.locale),
      viewDate: this.props.date,
      selectedDate: this.props.date,
      displayed: displayed
    };
  },

  // DaysPicker props function

  subtractMonth: function subtractMonth() {
    var viewDate = this.state.viewDate;
    var newDate = new Date(viewDate.valueOf());

    newDate.setMonth(viewDate.getMonth() - 1);
    this.setState({
      viewDate: newDate
    });
  },

  addMonth: function addMonth() {
    var viewDate = this.state.viewDate;
    var newDate = new Date(viewDate.valueOf());

    newDate.setMonth(viewDate.getMonth() + 1);
    this.setState({
      viewDate: newDate
    });
  },

  setSelectedDate: function setSelectedDate(event) {
    if (/disabled/ig.test(event.target.className)) {
      return;
    }

    var viewDate = this.state.viewDate;

    if (/new/ig.test(event.target.className)) {
      viewDate.setMonth(viewDate.getMonth() + 1);
    } else if (/old/ig.test(event.target.className)) {
      viewDate.setMonth(viewDate.getMonth() - 1);
    }

    viewDate.setDate(event.target.innerHTML);

    this.setViewDate(viewDate);
  },

  setViewDate: function setViewDate(viewDate) {
    this.setState({
      viewDate: viewDate,
      selectedDate: new Date(viewDate.valueOf())
    }, function () {
      this.props.onSelect(this.state.selectedDate);
      this.props.onClose && this.props.onClose();
    });
  },

  showMonths: function showMonths() {
    return this.setState({
      displayed: {
        days: { display: 'none' },
        months: { display: 'block' },
        years: { display: 'none' }
      }
    });
  },

  // MonthsPicker props function

  subtractYear: function subtractYear() {
    var viewDate = this.state.viewDate;
    var newDate = new Date(viewDate.valueOf());

    newDate.setFullYear(viewDate.getFullYear() - 1);

    return this.setState({
      viewDate: newDate
    });
  },

  addYear: function addYear() {
    var viewDate = this.state.viewDate;
    var newDate = new Date(viewDate.valueOf());

    newDate.setFullYear(viewDate.getFullYear() + 1);
    return this.setState({
      viewDate: newDate
    });
  },

  showYears: function showYears() {
    return this.setState({
      displayed: {
        days: { display: 'none' },
        months: { display: 'none' },
        years: { display: 'block' }
      }
    });
  },

  setViewMonth: function setViewMonth(event) {
    var viewDate = this.state.viewDate;
    var month = event.target.innerHTML;
    var months = this.state.locale.monthsShort;
    var i = 0;
    var len = months.length;

    for (; i < len; i++) {
      if (month === months[i]) {
        viewDate.setMonth(i);
      }
    }

    if (this.props.minViewMode === 'months') {
      this.setViewDate(viewDate);
    }

    this.setState({
      viewDate: viewDate,
      displayed: {
        days: { display: 'block' },
        months: { display: 'none' },
        years: { display: 'none' }
      }
    });
  },

  // YearsPicker props function

  setViewYear: function setViewYear(event) {
    var year = event.target.innerHTML;
    var viewDate = this.state.viewDate;

    viewDate.setFullYear(year);

    if (this.props.minViewMode === 'years') {
      this.setViewDate(viewDate);
    }

    this.setState({
      viewDate: viewDate,
      displayed: {
        days: { display: 'none' },
        months: { display: 'block' },
        years: { display: 'none' }
      }
    });
  },

  addDecade: function addDecade() {
    var viewDate = this.state.viewDate;
    var newDate = new Date(viewDate.valueOf());

    newDate.setFullYear(viewDate.getFullYear() + 10);
    this.setState({
      viewDate: newDate
    });
  },

  subtractDecade: function subtractDecade() {
    var viewDate = this.state.viewDate;
    var newDate = new Date(viewDate.valueOf());

    newDate.setFullYear(viewDate.getFullYear() - 10);

    this.setState({
      viewDate: newDate
    });
  },

  // render children
  renderDays: function renderDays() {
    return React.createElement(DaysPicker, {
      style: this.state.displayed.days,
      selectedDate: this.state.selectedDate,
      viewDate: this.state.viewDate,

      subtractMonth: this.subtractMonth,
      addMonth: this.addMonth,
      setSelectedDate: this.setSelectedDate,
      showMonths: this.showMonths,

      format: this.props.format,
      locale: this.state.locale,
      weekStart: this.props.weekStart,
      daysOfWeekDisabled: this.props.daysOfWeekDisabled,
      minDate: this.props.minDate,
      maxDate: this.props.maxDate
    });
  },

  renderMonths: function renderMonths() {
    return React.createElement(MonthsPicker, {
      style: this.state.displayed.months,
      locale: this.state.locale,
      addYear: this.addYear,
      subtractYear: this.subtractYear,
      viewDate: this.state.viewDate,
      selectedDate: this.state.selectedDate,
      showYears: this.showYears,
      setViewMonth: this.setViewMonth });
  },

  renderYears: function renderYears() {
    return React.createElement(YearsPicker, {
      style: this.state.displayed.years,
      viewDate: this.state.viewDate,
      selectDate: this.state.selectedDate,
      setViewYear: this.setViewYear,
      addDecade: this.addDecade,
      subtractDecade: this.subtractDecade });
  },

  render: function render() {
    return React.createElement(
      'div',
      { className: this.prefixClass('body') },
      this.renderDays(),
      this.renderMonths(),
      this.renderYears()
    );
  }
});

var DaysPicker = createReactClass({
  mixins: [ClassNameMixin],

  propTypes: {
    subtractMonth: PropTypes.func.isRequired,
    addMonth: PropTypes.func.isRequired,

    setSelectedDate: PropTypes.func.isRequired,
    selectedDate: PropTypes.object.isRequired,

    viewDate: PropTypes.object.isRequired,
    showMonths: PropTypes.func.isRequired,

    locale: PropTypes.object,
    weekStart: PropTypes.number,
    daysOfWeekDisabled: PropTypes.array,
    minDate: PropTypes.string,
    maxDate: PropTypes.string
  },

  getDefaultProps: function getDefaultProps() {
    return {
      classprefix: 'datepicker'
    };
  },

  renderDays: function renderDays() {
    var row;
    var i;
    var _ref;
    var _i;
    var _len;
    var prevY;
    var prevM;
    var classes = {};
    var html = [];
    var cells = [];
    var weekStart = this.props.weekStart || this.props.locale.weekStart;

    var weekEnd = (weekStart + 6) % 7;

    var d = this.props.viewDate;
    var year = d.getFullYear();
    var month = d.getMonth();
    var selectedDate = this.props.selectedDate;

    var currentDate = new Date(selectedDate.getFullYear(), selectedDate.getMonth(), selectedDate.getDate(), 0, 0, 0, 0).valueOf();

    var prevMonth = new Date(year, month - 1, 28, 0, 0, 0, 0);
    var day = dateUtils.getDaysInMonth(prevMonth.getFullYear(), prevMonth.getMonth());

    prevMonth.setDate(day);
    prevMonth.setDate(day - (prevMonth.getDay() - weekStart + 7) % 7);

    var nextMonth = new Date(prevMonth);

    nextMonth.setDate(nextMonth.getDate() + 42);
    nextMonth = nextMonth.valueOf();

    var minDate = this.props.minDate && fecha.parse(this.props.minDate);
    var maxDate = this.props.maxDate && fecha.parse(this.props.maxDate);

    while (prevMonth.valueOf() < nextMonth) {
      classes[this.prefixClass('day')] = true;

      prevY = prevMonth.getFullYear();
      prevM = prevMonth.getMonth();

      // set className old new
      if (prevM < month && prevY === year || prevY < year) {
        classes[this.prefixClass('old')] = true;
      } else if (prevM > month && prevY === year || prevY > year) {
        classes[this.prefixClass('new')] = true;
      }

      // set className active
      if (prevMonth.valueOf() === currentDate) {
        classes[this.setClassNamespace('active')] = true;
      }

      // set className disabled
      if (minDate && prevMonth.valueOf() < minDate || maxDate && prevMonth.valueOf() > maxDate) {
        classes[this.setClassNamespace('disabled')] = true;
      }

      // week disabled
      if (this.props.daysOfWeekDisabled) {
        _ref = this.props.daysOfWeekDisabled;
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          i = _ref[_i];
          if (prevMonth.getDay() === this.props.daysOfWeekDisabled[i]) {
            classes[this.setClassNamespace('disabled')] = true;
            break;
          }
        }
      }

      cells.push(React.createElement(
        'td',
        {
          key: prevMonth.getMonth() + '-' + prevMonth.getDate(),
          className: classNames(classes),
          onClick: this.props.setSelectedDate
        },
        prevMonth.getDate()
      ));

      // add tr
      if (prevMonth.getDay() === weekEnd) {
        row = React.createElement(
          'tr',
          { key: prevMonth.getMonth() + '-' + prevMonth.getDate() },
          cells
        );
        html.push(row);
        cells = [];
      }

      classes = {};
      prevMonth.setDate(prevMonth.getDate() + 1);
    }

    return html;
  },

  renderWeek: function renderWeek() {
    var ths = [];
    var locale = this.props.locale;
    var weekStart = this.props.weekStart || this.props.locale.weekStart;
    var weekEnd = weekStart + 7;

    while (weekStart < weekEnd) {
      ths.push(React.createElement(
        'th',
        { key: weekStart, className: this.prefixClass('dow') },
        locale.daysMin[weekStart++ % 7]
      ));
    }

    return React.createElement(
      'tr',
      null,
      ths
    );
  },

  render: function render() {
    var viewDate = this.props.viewDate;
    var prefixClass = this.prefixClass;
    var locale = this.props.locale;

    return React.createElement(
      'div',
      {
        className: prefixClass('days'),
        style: this.props.style },
      React.createElement(
        'table',
        { className: prefixClass('table') },
        React.createElement(
          'thead',
          null,
          React.createElement(
            'tr',
            { className: prefixClass('header') },
            React.createElement(
              'th',
              { className: prefixClass('prev'), onClick: this.props.subtractMonth },
              React.createElement('i', { className: prefixClass('prev-icon') })
            ),
            React.createElement(
              'th',
              {
                className: prefixClass('switch'),
                colSpan: '5',
                onClick: this.props.showMonths },
              React.createElement(
                'div',
                { className: this.prefixClass('select') },
                locale.monthsShort[viewDate.getMonth()],
                viewDate.getFullYear()
              )
            ),
            React.createElement(
              'th',
              { className: prefixClass('next'), onClick: this.props.addMonth },
              React.createElement('i', { className: prefixClass('next-icon') })
            )
          ),
          this.renderWeek()
        ),
        React.createElement(
          'tbody',
          null,
          this.renderDays()
        )
      )
    );
  }
});

var MonthsPicker = createReactClass({
  mixins: [ClassNameMixin],

  propTypes: {
    locale: PropTypes.object,
    subtractYear: PropTypes.func.isRequired,
    addYear: PropTypes.func.isRequired,
    viewDate: PropTypes.object.isRequired,
    selectedDate: PropTypes.object.isRequired,
    showYears: PropTypes.func.isRequired,
    setViewMonth: PropTypes.func.isRequired,
    minDate: PropTypes.string,
    maxDate: PropTypes.string
  },

  getDefaultProps: function getDefaultProps() {
    return {
      classprefix: 'datepicker'
    };
  },

  renderMonths: function renderMonths() {
    var classes = {};
    var month = this.props.selectedDate.getMonth();
    var year = this.props.selectedDate.getFullYear();
    var i = 0;
    var months = [];
    var minDate = this.props.minDate && fecha.parse(this.props.minDate);
    var maxDate = this.props.maxDate && fecha.parse(this.props.maxDate);
    var prevMonth = new Date(year, month);

    // TODO: minDate maxDate months
    while (i < 12) {
      classes[this.prefixClass('month')] = true;

      if (this.props.viewDate.getFullYear() === this.props.selectedDate.getFullYear() && i === month) {
        classes[this.setClassNamespace('active')] = true;
      }

      // set className disabled
      if (minDate && prevMonth.valueOf() < minDate || maxDate && prevMonth.valueOf() > maxDate) {
        classes[this.setClassNamespace('disabled')] = true;
      }

      months.push(React.createElement(
        'span',
        {
          className: classNames(classes),
          onClick: this.props.setViewMonth,
          key: i },
        this.props.locale.monthsShort[i]
      ));

      classes = {};
      i++;
    }

    return months;
  },

  render: function render() {
    return React.createElement(SubPicker, {
      displayName: 'months',
      style: this.props.style,
      subtract: this.props.subtractYear,
      add: this.props.addYear,
      showFunc: this.props.showYears,
      showText: this.props.viewDate.getFullYear(),
      body: this.renderMonths() });
  }
});

var YearsPicker = createReactClass({
  mixins: [ClassNameMixin],

  propTypes: {
    viewDate: PropTypes.object.isRequired,
    selectDate: PropTypes.object.isRequired,
    subtractDecade: PropTypes.func.isRequired,
    addDecade: PropTypes.func.isRequired,
    setViewYear: PropTypes.func.isRequired
  },

  getDefaultProps: function getDefaultProps() {
    return {
      classprefix: 'datepicker'
    };
  },

  renderYears: function renderYears() {
    var classes = {};
    var years = [];
    var i = -1;
    var year = parseInt(this.props.viewDate.getFullYear() / 10, 10) * 10;

    year--;

    while (i < 11) {
      classes[this.prefixClass('year')] = true;

      if (i === -1 || i === 10) {
        classes[this.prefixClass('old')] = true;
      }

      if (this.props.selectDate.getFullYear() === year) {
        classes[this.setClassNamespace('active')] = true;
      }

      years.push(React.createElement(
        'span',
        {
          className: classNames(classes),
          onClick: this.props.setViewYear,
          key: year },
        year
      ));

      classes = {};
      year++;
      i++;
    }

    return years;
  },

  render: function render() {
    var year = parseInt(this.props.viewDate.getFullYear() / 10, 10) * 10;
    var addYear = year + 9;
    var showYear = year + '-' + addYear;

    return React.createElement(SubPicker, {
      displayName: 'years',
      style: this.props.style,
      subtract: this.props.subtractDecade,
      add: this.props.addDecade,
      showText: showYear,
      body: this.renderYears() });
  }
});

var SubPicker = createReactClass({
  mixins: [ClassNameMixin],

  getDefaultProps: function getDefaultProps() {
    return {
      classprefix: 'datepicker'
    };
  },

  render: function render() {
    var prefixClass = this.prefixClass;

    return React.createElement(
      'div',
      {
        className: prefixClass(this.props.displayName),
        style: this.props.style },
      React.createElement(
        'table',
        { className: prefixClass('table') },
        React.createElement(
          'thead',
          null,
          React.createElement(
            'tr',
            { className: prefixClass('header') },
            React.createElement(
              'th',
              { className: prefixClass('prev'), onClick: this.props.subtract },
              React.createElement('i', { className: prefixClass('prev-icon') })
            ),
            React.createElement(
              'th',
              {
                className: prefixClass('switch'),
                colSpan: '5',
                onClick: this.props.showFunc },
              React.createElement(
                'div',
                { className: this.prefixClass('select') },
                this.props.showText
              )
            ),
            React.createElement(
              'th',
              { className: prefixClass('next'), onClick: this.props.add },
              React.createElement('i', { className: prefixClass('next-icon') })
            )
          )
        ),
        React.createElement(
          'tbody',
          null,
          React.createElement(
            'tr',
            null,
            React.createElement(
              'td',
              { colSpan: '7' },
              this.props.body
            )
          )
        )
      )
    );
  }
});

module.exports = DatePicker;
import React, { Component } from 'react';
import ActivityTracker from '../services/activity/tracker';
import ActivityCommiter from '../services/activity/committer';

export default class ApplicationComponent extends Component {

  constructor(props) {
    super(props);
    this.startErrorLog();
  }

  startErrorLog() {
    window.onerror = (message, file, line, column, errorObject) => {
      column = column || (window.event && window.event.errorCharacter);
      let stack = errorObject ? errorObject.stack : null;

      //trying to get stack from IE
      if (!stack) {
        stack = [];
        let f = arguments.callee.caller;
        while (f) {
          stack.push(f.name);
          f = f.caller;
        }
        errorObject['stack'] = stack;
      }

      const data = {
        exception_message: message,
        file: file,
        line: line,
        column: column,
        errorStack: stack,
        short_message: 'js_error',
        tag: 'exception'
      };
      data.short_message = 'js_error';
      new ActivityTracker().storeData('', data);
      new ActivityCommiter().commit();
      return false;
    }
  }
}

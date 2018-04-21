import React, {Component} from "react"
import moment from 'moment'
import {cleanString} from "../../../constants/color";
import * as _ from 'lodash';

require('moment-duration-format')

export default class Progress extends Component {

  constructor(props) {
    super(props)
    this.state = {
      progress: 0,
      timeLeft: 'Timed out',
      translate_time: null,
      timer: null,
      timerClass: 'timer-danger'
    }
  }

  componentWillUnmount() {
    const self = this;
    clearInterval(self.state.timer);
  }

  componentWillMount() {
    this.computeProgress(this.props.mrks);
    this.timelapse();
  }

  componentWillReceiveProps(nextProps) {
    const self = this
    this.computeProgress(nextProps.mrks)
    if (self.state.timer) {
      clearInterval(self.state.timer)
    }
    this.timelapse(nextProps)
  }

  validateNonTranslatableMrk(text) {
    const wrapper = $('<div>').html(text)
    wrapper.find('> x').remove()
    return cleanString(wrapper.html()).length
  }

  computeProgress(mrks) {
    const self = this;
    let string_count = 0;
    let string_translated = 0;
    const app = self.props.app;
    const actions = app.actions.cms_actions;

    mrks.map((sentence, index) => {
      const target = sentence.target_mrk;
      const string = target.content;
      if (string && self.validateNonTranslatableMrk(string)) {
        if (string.length) ++string_count;
        if (_.includes([2, 3], target.mrk_status)) ++string_translated;
      }
    });

    self.setState({
      progress: ((string_translated / string_count) * 100).toFixed(2)
    }, () => {
      actions.setCmsProgress(self.state.progress)
    })
  }

  timelapse() {
    const self = this;
    const deadline = moment.unix(self.props.deadline);
    let timeLeft = '';
    const timer = setInterval(function () {
      timeLeft = moment.duration(deadline.diff(moment()));

      if (timeLeft.asSeconds() > 0) self.setState({
        timeLeft: timeLeft.format("d [days] h:mm"),
        timerClass: 'timer-default'
      });
    }, 1000);
    self.setState({
      timer: timer
    });
  }

  render() {
    const self = this
    return (
      <div id="cmsProgress">
        <div className="row">
          <div className="col-md-5">
            <div className="custom-progress-success" style={{marginTop: '15px'}}>
              <div key={self.state.progress + '_progress'} className="progress">
                <div className="progress-bar progress-bar-success"
                     role="progressbar"
                     aria-valuenow={self.state.progress}
                     aria-valuemin="0"
                     aria-valuemax="100"
                     style={{width: `${self.state.progress}%`}}>{Math.round(self.state.progress) || 0}%
                </div>
              </div>
            </div>
          </div>
          <div className="col-md-7">
            <p className={`text-center timer ${self.state.timerClass}`} style={{marginTop: '8px'}}>
              <span className="fa fa-clock-o"></span> {self.state.timeLeft}
            </p>
          </div>
        </div>
      </div>
    )
  }

}

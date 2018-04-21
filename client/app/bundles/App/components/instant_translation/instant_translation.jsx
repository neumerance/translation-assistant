import React, {PropTypes} from 'react';
import {Link} from 'react-router'
import JobPanel from './job_panel'
import InstantTranslationIndex from './index'
import InstantTranslationShow from './show'
import {pluck} from '../../services/utils/app_constants'
import Notification from 'react-web-notification'
import {iso_lang_hash} from '../../services/utils/app_constants'
import {hashHistory} from 'react-router'
import * as browserCheck from '../../services/utils/browser_check';

export default class InstantTranslation extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      it_interval: null,
      title: ''
    }
  }

  componentWillMount() {
    const self = this
    const app = self.props.app
    browserCheck.redirectIfNotSupportedBrowser(app.router);
    const action = app.actions.it_actions
    action.getInstantTranslationJobs()
    self.setState({
      it_interval: setInterval(() => {
        action.getInstantTranslationJobs(false);
      }, 30000)
    })
  }

  playSound(filename) {
    document.getElementById('sound').play();
  }

  handleNotificationOnShow(e, tag) {
    this.playSound();
  }

  handleNotificationOnClick(e, tag) {
    const self = this
    const app = self.props.app
    if (app.instant_translation_jobs.open.length) {
      const tag_id = tag.split('-').slice(-1).pop()
      const content = app.instant_translation_jobs.open[parseInt(tag_id)]
      hashHistory.push('/instant_translation/' + content.id)
    }
  }

  handleButtonClick(content, index) {
    const now = Date.now()
    const title = 'New instant translation work is available: ' + content.name
    const body = iso_lang_hash[content.client_language_id].name + ' to ' + iso_lang_hash[content.visitor_language_id].name
    const tag = index
    const icon = 'images/success-icon.png';
    const options = {
      tag: tag,
      body: body,
      icon: icon,
      lang: 'en',
      dir: 'ltr',
      sound: 'notification/success.mp3'
    }
    this.setState({
      title: title,
      options: options
    });
  }

  componentWillReceiveProps(nextProps) {
    const self = this
    const prevApp = self.props.app
    const nextApp = nextProps.app
    if (prevApp.instant_translation_jobs.open.length && nextApp.instant_translation_jobs.open.length) {
      const prevIds = pluck(prevApp.instant_translation_jobs.open, 'id')
      const nextIds = pluck(nextApp.instant_translation_jobs.open, 'id')
      const difference = []
      $.grep(nextIds, function (el) {
        if ($.inArray(el, prevIds) == -1) difference.push(el)
      })
      $.each(nextApp.instant_translation_jobs.open, function (index, object) {
        if ($.inArray(object.id, difference) >= 0) {
          self.handleButtonClick(object, $.inArray(object.id, difference))
        }
      })
    }
  }

  componentWillUnmount() {
    const self = this
    clearInterval(self.state.it_interval)
  }

  render() {
    let self = this
    const app = self.props.app

    let content = null
    let page = null

    if (app.instant_translation_jobs.open != undefined) {
      content = <JobPanel app={ self.props.app } jobs={ app.instant_translation_jobs }/>
    }

    if (self.props.params.id) {
      page = <InstantTranslationShow app={ self.props.app } id={ self.props.params.id }/>
    } else {
      page = <InstantTranslationIndex />
    }

    return (
      <div className="container">
        <div className="row">
          <div className="col-md-4">
            { content }
          </div>
          <div className="col-md-8">
            { page }
            <div>
              <Notification
                onShow={this.handleNotificationOnShow.bind(this)}
                onClick={ this.handleNotificationOnClick.bind(this) }
                timeout={5000}
                title={this.state.title}
                options={this.state.options}
              />
              <audio id='sound' preload='auto'>
                <source src='notification/success.mp3' type='audio/mpeg'/>
                <source src='notification/success.ogg' type='audio/ogg'/>
                <embed hidden="true" autoPlay="false" loop="false" src="notification/success.mp3"/>
              </audio>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

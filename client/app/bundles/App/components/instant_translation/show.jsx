import React, {PropTypes} from 'react'
import Confirm from 'react-confirm-bootstrap'
import {iso_lang_hash} from '../../services/utils/app_constants'
import InstantTranslationTranslationField from './translation_field'
import Countdown from '../../constants/countdown'
import moment from 'moment'
import { CleanLocalizationClient as t } from "../clean_localization/client";

require("moment-duration-format")
import {getCountryFlag} from '../../services/utils/country';

class InstantTranslationShow extends React.Component {

  constructor(props) {
    super(props)
    this.state = {
      timeleft: '00:00:00'
    }
  }

  componentWillMount() {
    const self = this
    const app = self.props.app
    const action = app.actions.it_actions
    if (self.props.id) {
      action.showInstantTranslation(self.props.id)
    }
  }

  componentWillReceiveProps(nextProps) {
    const self = this
    const app = self.props.app
    const action = app.actions.it_actions
    if (self.props.id != nextProps.id) {
      action.showInstantTranslation(nextProps.id)
    }
  }

  save() {
    const self = this
    const app = self.props.app
    const action = app.actions.it_actions
    action.saveInstantTranslation({id: app.instant_translation.id, translations: app.instant_translation.visitor_body})
  }

  calculateRemainingTime(time, word_count) {
    let word_count_time = ( (parseInt(word_count) <= 12) ? 300 : parseInt(word_count) * 25 )
    const total_time = moment(time).add(word_count_time, 'seconds')
    const duration = moment.duration(total_time.diff(moment()))
    return duration.asSeconds()
  }

  releaseOnCountdownEnds(id) {
    const self = this
    const app = self.props.app
    const action = app.actions.it_actions
    action.releaseInstantTranslation(id)
  }

  render() {
    const self = this
    const app = self.props.app
    const action = app.actions.it_actions

    const instant_translation = app.instant_translation

    let content = null
    let translation_field = null
    let take_button = null
    let instance = null

    if (instant_translation) {
      if (!instant_translation.is_owned_by_current_translator && ( instant_translation.translation_status == 2 )) {
        take_button = <button className="btn btn-primary pull-right"
                              onClick={action.takeInstantTranslation.bind(self, instant_translation.id)}>
            {t.translate('instant_translation.job.start_btn')}
        </button>
      }

      if (instant_translation.is_owned_by_current_translator) {
        const secs = self.calculateRemainingTime(instant_translation.translate_time, instant_translation.word_count)
        translation_field = <div className="panel panel-default">
          <div className="panel-heading">
            {t.t('instant_translation.job.panels.target.to')}
            <span className={'m-l-5 flag-icon flag-icon-' + getCountryFlag(iso_lang_hash[instant_translation.visitor_language_id].name)}></span> {iso_lang_hash[instant_translation.visitor_language_id].name}
          </div>
          <div className="panel-body">
            <InstantTranslationTranslationField app={app} instant_translation={instant_translation}/>
            <div className="row">
              <div className="col-md-4 text-left">
                <Confirm
                  onConfirm={action.releaseInstantTranslation.bind(self, instant_translation.id)}
                  body={t.t('instant_translation.job.panels.target.cancel.confirm')}
                  confirmText="Yes"
                  title="Attention">
                  <button className="btn btn-default btn-sm m-r-5">{t.t('instant_translation.job.panels.target.cancel.btn')}</button>
                </Confirm>
              </div>
              <div className="col-md-4 text-center">
                <p className={'text-center timer-danger'}>
                  <span className="fa fa-clock-o"></span> <Countdown seconds={secs}
                                                                     onEnd={self.releaseOnCountdownEnds.bind(self, instant_translation.id)}/>
                </p>
              </div>
              <div className="col-md-4 text-right">
                <Confirm
                  onConfirm={self.save.bind(this)}
                  body={t.t('instant_translation.job.panels.target.complete.confirm')}
                  confirmText="Yes"
                  title="Attention">
                  <button className="btn btn-success btn-sm">{t.t('instant_translation.job.panels.target.complete.btn')}</button>
                </Confirm>
              </div>
            </div>
          </div>
        </div>
      }

      content = <div>
        <div className="panel panel-default">
          <div className="panel-heading bg-success text-white">
            <span>
                {t.t('instant_translation.job.panels.desc.translate')} {t.t('instant_translation.job.panels.desc.from')}
                <span className={'m-r-5 m-l-5 flag-icon flag-icon-' + getCountryFlag(iso_lang_hash[instant_translation.client_language_id].name)}></span>
                {iso_lang_hash[instant_translation.client_language_id].name} {t.t('instant_translation.job.panels.desc.to')}
                <span className={'m-r-5 m-l-5 flag-icon flag-icon-' + getCountryFlag(iso_lang_hash[instant_translation.visitor_language_id].name)}></span> {iso_lang_hash[instant_translation.visitor_language_id].name}
            </span>
            <span className="pull-right">
                {instant_translation.word_count} words
            </span>
          </div>
          <div className="panel-body">
            {instant_translation.comment}
          </div>
        </div>
        <div className="panel panel-default">
          <div className="panel-heading">
            {t.t('instant_translation.job.panels.source.from')}
            <span className={'m-l-5 flag-icon flag-icon-' + getCountryFlag(iso_lang_hash[instant_translation.client_language_id].name)}></span> {iso_lang_hash[instant_translation.client_language_id].name}
          </div>
          <div className="panel-body">
            <h5>{instant_translation.name}</h5>
            {instant_translation.client_body}
          </div>
        </div>
        {take_button}
      </div>
    }

    return (
      <div className="row">
        {content}
        {translation_field}
      </div>
    );
  }
}

export default InstantTranslationShow;

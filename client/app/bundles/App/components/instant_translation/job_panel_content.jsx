import React from 'react'
import moment from 'moment'
import { iso_lang_hash } from '../../services/utils/app_constants'
import { getCountryFlag } from '../../services/utils/country';
import { Link } from 'react-router'
require("moment-duration-format")
import { CleanLocalizationClient as t } from "../clean_localization/client";

export default class JobPanelContent extends React.Component {

    constructor(props) {
        super(props)
        const self = this
        self.state = {
            timer: null
        }
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
        const content = this.props.content
        let container = null

        if (content) {
            container = <div className="no-text-decoration">
                <Link to={ 'instant_translation/'+content.id }>
                    <div className="panel-body">
                        <h5 className="p-0 m-b-10">
                            { content.name } - (ID: {content.id})
                        </h5>
                        <span><span className={'flag-icon flag-icon-'+getCountryFlag(iso_lang_hash[content.client_language_id].name)}></span> { iso_lang_hash[content.client_language_id].name }</span> &raquo; <span><span className={'flag-icon flag-icon-'+getCountryFlag(iso_lang_hash[content.visitor_language_id].name)}></span> { iso_lang_hash[content.visitor_language_id].name }</span>
                    </div>
                    <div className="text-center bg-success text-white">
                        <small>{content.word_count} {t.t('instant_translation.panels.content.words')}</small>
                    </div>
                </Link>
            </div>
        }

        return (
            <div className="panel panel-default job_content no-border-radius">
                { container }
            </div>
        )
    }
} 
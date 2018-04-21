import React from 'react'
import { Accordion, Panel } from 'react-bootstrap'
import { Scrollbars } from 'react-custom-scrollbars'
import JobPanelContent from './job_panel_content'
import { CleanLocalizationClient as t } from "../clean_localization/client";

export default class JobPanel extends React.Component {

    constructor (props) {
        super(props)
        this.state = { activeKey: 2 }
    }

    handleSelect(activeKey) {
        this.setState({ activeKey });
    }

    componentWillReceiveProps(nextProps) {
        const self = this
        if(nextProps) {
            const jobs = nextProps.jobs
            if(jobs.in_progress) {
                self.handleSelect(1)
            } else {
                self.handleSelect(2)
            }
        }
    }

    render() {
        const self = this
        const app = self.props.app
        const action = app.actions.it_actions
        let jobs = this.props.jobs
        let open = null
        let current = null
        
        if(jobs.in_progress) {
            current = <Panel header={t.t('instant_translation.panels.current')} eventKey={ 1 } className="panel panel-success">
                        <JobPanelContent app={ app } key={ jobs.in_progress.id + '_completd' } content={ jobs.in_progress } />
                      </Panel>
        }

        if(jobs.open.length) {
            open = jobs.open.map(
                function(content, index){
                    return (
                        <JobPanelContent app={ app } key={ index + '_open' } content={ content } />
                    )
                }
            )
        } else {
            open = <p>{t.t('instant_translation.panels.no_open_job')}</p>
        }

        const open_job_header = <span>
                                {t.t('instant_translation.panels.open')} <button className="btn btn-default btn-xs pull-right it-refresh-btn" onClick={ action.getInstantTranslationJobs.bind(self) }><i className="fa fa-refresh"></i></button>
                                </span>

        return (
            <div className="jobPanel">
                <Accordion activeKey={ this.state.activeKey } onSelect={ (e) => this.handleSelect(e) }>
                    { current }
                    <Panel header={ open_job_header } eventKey={ 2 }>
                        <Scrollbars id="open_jobs_panel" autoHeight autoHeightMin={0} autoHeightMax={600} autoHide={false}>
                          { open }
                        </Scrollbars>
                    </Panel>
                </Accordion>
            </div>
        );
    }
}
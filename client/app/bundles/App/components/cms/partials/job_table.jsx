import React, {Component} from 'react';
import {Panel} from 'react-bootstrap';
import * as _ from 'lodash';
import CmsApiRequests from '../../../services/requests/cms_api_requests';
const api = new CmsApiRequests();
import {OverlayTrigger, Popover, ProgressBar} from 'react-bootstrap';
import * as countryUtils from '../../../services/utils/country';
import * as appConstants from '../../../services/utils/app_constants';
import moment from 'moment';
import Moment from 'react-moment';
import {Link} from 'react-router';
import {WordsScanner} from '../../../services/glossary/words_scanner';
const wordScanner = new WordsScanner();
import PreloaderIcon from './preloader_icon';
import CmsPaginator from './paginator';
import { CleanLocalizationClient as t } from '../../clean_localization/client';

export default class JobTable extends Component {

  constructor(props) {
    super(props);
    const self = this;
    self.state = {
      jobs: [],
      pagination: {},
      expanded: false,
      requestIsDone: false,
      jobIdFilter: null,
      id: null,
      project_name: null,
      website_name: null,
      source_language: null,
      target_language: null
    }
  }

  componentDidMount() {
    const self = this;
    self.getJobs();
    if (self.props.type == 'open') self.toggleExpansions();
  }

  resetAllFieldSortingDirection(state) {
    state.id = null;
    state.project_name = null;
    state.website_name = null;
    state.source_language = null;
    state.target_language = null;
    return state;
  }

  getJobs(page = 1, fieldName = null) {
    this.setState({ requestIsDone: false }, () => {
      const params = {type: this.props.type, page: page, per: 10};
      if (fieldName) {
        params.sort = fieldName;
        let sortDir = 'asc';
        if (this.state[fieldName]) {
          sortDir = this.state[fieldName] == 'asc' ? 'desc' : 'asc';
        }
        params.sort_order = sortDir;
      }
      if (this.state.jobIdFilter) params.job_id = self.state.jobIdFilter;
      api.getCmsJobs(params, (data) => {
        let currentState = this.state;
        currentState.jobs = _.get(data, 'jobs', []);
        currentState.pagination = _.get(data, 'pagination', {});
        currentState.requestIsDone = true;
        if (fieldName) {
          currentState = this.resetAllFieldSortingDirection(currentState);
          currentState[fieldName] = params.sort_order;
        }
        this.setState(currentState);
      });
    });
  }

  panelHeader() {
    const self = this;
    const props = self.props;
    let sideTools = <span className="pull-right"><PreloaderIcon /></span>;
    if (self.state.requestIsDone) sideTools = <span className="pull-right">
      <label className="badge badge-info m-r-5">{_.get(self.state.pagination, 'total_jobs', 0)}</label>
      <button className="btn btn-xs btn-default"
              onClick={ () => { self.getJobs() } }>
        <span className="fa fa-refresh"></span>
      </button>
    </span>

    return (
      <div className="panelHeader">
        <div className="row m-0 p-0">
          <div className="col-md-11 m-0 p-0"><span className="block" onClick={self.toggleExpansions.bind(this)}>{ t.t(`dashboard.jobs.panel.${this.props.type}`) }</span></div>
          <div className="col-md-1 m-0 p-0">{sideTools}</div>
        </div>
      </div>
    )
  }

  renderLabels() {
    const self = this;
    const fields = ['id', 'project_name', 'website_name', 'source_language', 'target_language'];
    const ths = fields.map((fieldName, idx) => {
      const title = _.kebabCase(_.camelCase(fieldName)).split('-').join(' ').replace('name', '');
      let sortDir = 'sort';
      if (self.state[fieldName]) {
          sortDir = self.state[fieldName] === 'desc' ? 'sort-down' : 'sort-up';
      }
      return (
        <th key={`${fieldName}${idx}`}>
          <a href="javascript:void(0)"
             className="block"
             onClick={ () => { self.getJobs(self.state.pagination.current_page, fieldName) } }>
            {t.t(`dashboard.jobs.panel.table.header.columns.label.${fieldName}`)} <span className={`fa fa-${sortDir}`}></span>
          </a>
        </th>
      )
    });

    return (
      <tr>
        {ths}
        <th style={ {width: '20%'} }>Progress</th>
        <th></th>   
      </tr>
    )
  }

  getProgressBarStatusClass(status) {
    let result = 'danger';
    let className = ['danger', 'warning', 'success'];
    if (className[status]) result = className[status];
    return result;
  }

  renderRows() {
    const self = this;
    let fetIndicator = <p>{t.t('dashboard.jobs.panel.table.body.rows.fetching_jobs')} <PreloaderIcon /></p>;
    if (self.state.requestIsDone) fetIndicator = <p>{t.t('dashboard.jobs.panel.table.body.rows.no_jobs')}</p>;
    let rows = <tr><td className="text-center" style={{border: '0', background: '#FFF'}} colSpan={8}>{fetIndicator}</td></tr>;
    if (self.state.jobs.length) rows = self.state.jobs.map((row, index) => {
      const rowKey = self.props.type + index;
      let progressPercentage = appConstants.calculatePercentage(
        _.get(row, 'progress_details.translated_words', 0),
        _.get(row, 'progress_details.total_words', 0)
      );

      if (row.status >= 5 && !row.progress_details.translated_words) {
        progressPercentage = 100;
      }
      const projectDetails = (
        <Popover key={`${rowKey}ProjectDetails`} id="projectDetails" className="popupDetails" title="Project Details">
          <ul className="nav">
            <li>
              <small className="m-r-5">{t.t('dashboard.jobs.panel.table.body.rows.project_details.project_name')}</small>
              <strong>{row.project.name}</strong></li>
            <li>
              <small className="m-r-5">{t.t('dashboard.jobs.panel.table.body.rows.project_details.deadline')}</small>
              <strong><Moment format="llll">{moment.unix(row.deadline)}</Moment></strong></li>
            <li>
              <small className="m-r-5">{t.t('dashboard.jobs.panel.table.body.rows.project_details.word_count')}</small>
              <strong>{row.progress_details.total_words}</strong></li>
            <li>
              <small className="m-r-5">{t.t('dashboard.jobs.panel.table.body.rows.project_details.progress')}</small>
              <strong>{parseInt(progressPercentage) + '%'}</strong></li>
          </ul>
        </Popover>
      )

      const websiteDetails = (
        <Popover key={`${rowKey}WebDetails`} id="webDetails" className="popupDetails" title="Website Details">
          <ul className="nav">
            <li>
              <small>Website Name:</small>
              <strong>{row.website.name}</strong></li>
            <li>
              <small>URL:</small>
              <strong>{row.website.url}</strong></li>
            <li>
              <small>Description:</small>
              <strong>{row.website.description}</strong></li>
          </ul>
        </Popover>
      )

      const progressClass = self.getProgressBarStatusClass(row.progress_details.status);

      const isReview = () => {
        return _.includes(['reviews', 'review_completed'], self.props.type);
      }

      let progressLabel = `${row.progress_details.translated_words}/${row.progress_details.total_words}`;
      const complexityWidth = row.progress_details.complexity * 8;
      if (row.status >= 5 && !row.progress_details.translated_words) {
        progressLabel = '100%';
        progressPercentage = 100;
      }

      return (
        <tr key={ `${rowKey}Row` }>
          <td>{row.id}</td>
          <td style={{width: '25%'}}>
            <OverlayTrigger trigger={ ['hover', 'focus'] } placement="top" overlay={websiteDetails}>
              <a href={row.permlink} target="_blank">{row.title}</a>
            </OverlayTrigger>
          </td>
          <td><a href={ row.website.url } target="_blank">{ row.website.name }</a></td>
          <td>
            <span className={`flag-icon m-r-10 flag-icon-${countryUtils.getCountryFlag(row.source_language.name)}`}></span>
            <span className="hidden-sm">{row.source_language.name}</span>
          </td>
          <td>
            <span className={`flag-icon m-r-10 flag-icon-${countryUtils.getCountryFlag(row.target_language.name)}`}></span>
            <span className="hidden-sm">{row.target_language.name}</span>
          </td>
          <td>
            <div className="row">
              <div style={{width: `${complexityWidth}%`}}>
                <OverlayTrigger trigger={ ['hover', 'focus'] } placement="top" overlay={projectDetails}>
                  <div className={`custom-progress-${progressClass} text-center relative`}>
                    <span className="block absolute white-text light-text-shadow top">{progressLabel}</span>
                    <ProgressBar now={parseInt(progressPercentage)}
                                 label={ '' }
                                 bsStyle={progressClass}/>
                  </div>
                </OverlayTrigger>
              </div>
            </div>
          </td>
          <td>
            <Link to={ `cms/${row.id}/${(isReview() ? 'review' : 'translate')}` }>
              <button className="btn btn-info btn-sm">{t.t(`dashboard.jobs.panel.table.body.rows.open_btn`)}</button>
            </Link>
          </td>
        </tr>
      )
    });
    return rows;
  }

  toggleExpansions() {
    const self = this;
    self.setState({expanded: !self.state.expanded})
  }

  renderDropDownOptions() {
    const self = this;
    const websiteFilterOptions = _.uniqBy(_.map(self.state.jobs, (data) => { return ({ id: data.website.id, name: data.website.name }) }), 'id');
    return websiteFilterOptions.map((row, id) => {
      return(
        <option key={id} value={row.id}>{row.name}</option>
      )
    });
  }

  filterByJobId(input) {
    this.setState({ jobIdFilter: input });
  }

  render() {
    const self = this;
    const props = self.props;
    let filter = null;
    filter = <div className="websiteDropDownFilter">
      <div className="pull-left">{t.t('dashboard.jobs.panel.table.header.filter.label.show_translation_jobs_from.left')}</div>
      <div className="pull-left">
        <select className="form-control" style={ {display: 'inline-block'} }>
          <option>-- All --</option>
          {self.renderDropDownOptions()}
        </select>
      </div>
      <div className="pull-left m-r-10">{t.t('dashboard.jobs.panel.table.header.filter.label.show_translation_jobs_from.right')}</div>
      <div className="pull-left">{t.t('dashboard.jobs.panel.table.header.filter.label.job_filter_id')}</div>
      <div className="pull-left">
        <input className="form-controller" type="text" onChange={(e) => { this.filterByJobId(e.target.value) }} style={{height: '34px'}} />
        <button className="btn btn-sm btn-default m-l-5" onClick={() => {this.getJobs()}}>{t.t('dashboard.jobs.panel.table.header.filter.label.search_btn')}</button>
      </div>
      <div className="clearfix"></div>
    </div>;
    return(
      <Panel header={self.panelHeader()}
             expanded={self.state.expanded}
             collapsible>
        {filter}
        <table className="table table-slim table-striped vertical-middle-table">
          <thead>
          { self.state.jobs.length ? self.renderLabels() : null }
          </thead>
          <tbody>
          { self.renderRows() }
          </tbody>
          <tfoot>
          { self.state.jobs.length ? self.renderLabels() : null }
          </tfoot>
        </table>
        <CmsPaginator pagination={self.state.pagination}
                      type={props.type}
                      getJobs={self.getJobs.bind(this)}  />
      </Panel>
    )
  }

}
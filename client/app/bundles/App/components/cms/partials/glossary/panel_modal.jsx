import React, { Component } from 'react';
import { Modal } from 'react-bootstrap';
import GlossaryItems from './glossary_items';
import { Scrollbars } from 'react-custom-scrollbars';
import * as _ from 'lodash';
import Notify from '../../../../constants/notify'
const notify = new Notify();
import GlossaryApiRequests from '../../../../services/requests/glossary_api_request';
const api = new GlossaryApiRequests();
import * as countryUtils from '../../../../services/utils/country';
import * as messages from '../../../../constants/app_messages';

export default class GlossaryPanelModal extends Component {

  constructor(props) {
    super(props);
    this.state = {
      glossaries: [],
      originalGlossary: [],
      saving: false
    }
  }

  componentWillReceiveProps(props) {
    const self = this;
    if(props.glossaries.length) self.setState({
      glossaries: _.cloneDeep(props.glossaries),
      originalGlossary: _.cloneDeep(props.glossaries)
    });
  }

  setGlossaryValues(index, newGlossary) {
    const self = this;
    const glossaries = self.state.glossaries;
    glossaries.splice(index, 1, newGlossary);
    self.setState({glossaries: glossaries});
  }

  removeRow(index) {
    const self = this;
    const glossaries = self.state.glossaries;
    _.pullAt(glossaries, index);
    self.setState({glossaries: glossaries});
  }

  addRow() {
    const self = this;
    const glossaries = self.state.glossaries;
    glossaries.push({ id: null, translated_text: null, description: null });
    self.setState({ glossaries: glossaries });
  }

  renderRows(renderUnsavedRows = false) {
    const self = this
    const cmsData = self.props.cmsData;
    let rows = renderUnsavedRows ? null : <tr><td colSpan={4}>No glossary terms yet.</td></tr>;
    if (self.state.glossaries.length) rows = self.state.glossaries.map((glossary, glossaryIndex) => {
      if (renderUnsavedRows) {
        if (glossary.id) return;
      } else {
        if (!glossary.id) return;
      }
      return (
        <GlossaryItems key={glossaryIndex}
                       cmsData={cmsData}
                       glossary={glossary}
                       glossaryIndex={glossaryIndex}
                       setGlossaryValues={self.setGlossaryValues.bind(this)}
                       removeRow={self.removeRow.bind(this)}  />
      )
    });
    return rows;
  }

  resetRows() {
    const self = this;
    self.setState({
      glossaries: self.state.originalGlossary,
      originalGlossary: _.cloneDeep(self.state.originalGlossary)
    });
    self.props.toggleGlossariesPanel()
  }

  update(glossary, callback = () => {}) {
    const self = this;
    const cmsData = self.props.cmsData;
    const params = {
      id: glossary.id,
      cms_request_id: _.get(cmsData, 'id', ''),
      target_language_id: _.get(cmsData, 'target_language.id', '')
    };
    params.translation = glossary.translated_text;
    params.description = glossary.description;
    api.updateGlossaryItem(params.id, params, callback);
  }

  create(glossary, callback = () => {}) {
    const self = this;
    const cmsData = self.props.cmsData;
    api.createGlossary(cmsData.id, glossary, callback);
  }

  validValues() {
    const self = this;
    let hasNoError = true;
    self.state.glossaries.map((glossary, index) => {
      if (!glossary.term || !glossary.translated_text || !glossary.description) hasNoError = false
    });
    if (!hasNoError) notify.error('Unable to save', 'All fields are required.');
    return hasNoError;
  }

  saveRows() {
    const self = this;
    const glossaries = self.state.glossaries;
    if (!self.validValues()) return;
    self.setState({
      saving: true
    }, () => {
      glossaries.map((glossary, idx) => {
        let callback = () => {
          const isLast = glossary == _.last(glossaries);
          if (isLast) {
            self.props.getAllGlossaries();
            self.props.toggleGlossariesPanel();
            self.setState({saving: false});
          }
        };
        if (glossary.id) self.update(glossary, callback);
        if (!glossary.id) self.create(glossary, callback);
      });
    })
  }

  render() {
    const self = this;
    const originalLanguage = _.get(self.props.cmsData, 'source_language.name','');
    const targetLanguage = _.get(self.props.cmsData, 'target_language.name','');

    return(
      <Modal show={self.props.show} bsSize="large" id="glossary-panel-modal">
        <Modal.Header>
          <Modal.Title>
            Project Glossary
            <a href="javascript:void(0)"
               onClick={() => {self.props.toggleGlossariesPanel()}}
               style={{marginTop: '-6px'}} className="pull-right closeLink">
              <i className="fa fa-close"></i>
            </a>
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <table className="table table-slim table-striped vertical-middle-table">
            <thead>
            <tr>
              <th className="width-25">
                <span className={`flag-icon flag-icon-${countryUtils.getCountryFlag(originalLanguage)} m-r-5`}></span> {_.upperFirst(originalLanguage)}
              </th>
              <th className="width-25">
                <span className={`flag-icon flag-icon-${countryUtils.getCountryFlag(targetLanguage)} m-r-5`}></span> {_.upperFirst(targetLanguage)}
              </th>
              <th className="width-40"> Description </th>
              <th className="width-10">
                <button className={`btn btn-success pull-right`} onClick={self.addRow.bind(this)}>Add New</button>
              </th>
            </tr>
            </thead>
          </table>
          <Scrollbars autoHide
                      autoHeight
                      autoHeightMin={200}
                      autoHeightMax={350}>
            <table className="table table-slim table-striped vertical-middle-table">
              <tbody>
              {self.renderRows(true)}
              {self.renderRows()}
              </tbody>
            </table>
          </Scrollbars>
        </Modal.Body>
        <Modal.Footer>
          <button className="btn btn-default pull-left" onClick={self.resetRows.bind(this)}>Cancel</button>
          <button className="btn btn-info" onClick={self.saveRows.bind(this)} disabled={self.state.saving}>Save</button>
        </Modal.Footer>
      </Modal>
    )
  }
}

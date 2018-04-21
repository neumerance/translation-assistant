import React, {Component} from 'react';
import {Modal, Button, FormGroup, FormControl} from 'react-bootstrap';
import GlossaryApiRequests from '../../../../services/requests/glossary_api_request';
const api = new GlossaryApiRequests();
import * as countryUtils from '../../../../services/utils/country';
import * as stringUtils from '../../../../services/utils/string_utils';
import * as _ from 'lodash';
import Notify from '../../../../constants/notify'
const notify = new Notify();
import * as messages from '../../../../constants/app_messages';

export default class NewGlossaryModal extends Component {

  constructor(props) {
    super(props);
    this.state = {
      saving: false,
      createParams: {
        term: null,
        description: null,
        translated_text: null
      }
    }
  }

  setFieldValue(field, input) {
    const self = this;
    const text = input.target.value;
    let nextParams = self.state.createParams;
    _.set(nextParams, field, text);
    self.setState({
      createParams: nextParams
    })
  }

  saveNewGlossary() {
    const self = this;
    const cmsData = self.props.cmsData;
    self.setState({
      saving: true
    }, () => {
      api.createGlossary(_.get(cmsData, 'id', ''), self.state.createParams, (data) => {
        self.props.getAllGlossaries();
        self.props.toggleNewGlossary();
        self.setState({
          createParams: {
            term: null,
            description: null,
            translated_text: null
          },
          saving: false
        })
      })
    });
  }

  render() {
    const self = this;
    const cmsData = self.props.cmsData;
    const originalLanguage = _.get(self.props.cmsData, 'source_language.name','');
    const targetLanguage = _.get(self.props.cmsData, 'target_language.name','');
    const targetIso = _.get(cmsData, 'target_language.iso', 'en');
    const sourceIso = _.get(cmsData, 'source_language.iso', 'en');

    return (
      <Modal show={self.props.showNewGlossaryModal}>
        <Modal.Header>
          <Modal.Title>New Glossary Term</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <FormGroup controlId="formTerm">
            <label>
              <span className="m-r-5">Term</span><span className={`flag-icon flag-icon-${countryUtils.getCountryFlag(originalLanguage)} m-r-5`}></span> {_.upperFirst(originalLanguage)}
            </label>
            <FormControl componentClass="input"
                         dir={stringUtils.getStringTypingDirection(sourceIso)}
                         ref="term"
                         onChange={ (e) => {
                           self.setFieldValue('term', e)
                         } }/>
          </FormGroup>
          <FormGroup controlId="formTranslation">
            <label>
              <span className="m-r-5">Translation</span><span className={`flag-icon flag-icon-${countryUtils.getCountryFlag(targetLanguage)} m-r-5`}></span> {_.upperFirst(targetLanguage)}
            </label>
            <FormControl componentClass="input"
                         dir={stringUtils.getStringTypingDirection(targetIso)}
                         ref="translated_text"
                         onChange={ (e) => {
                           self.setFieldValue('translated_text', e)
                         } }/>
          </FormGroup>
          <FormGroup controlId="formDescription">
            <label>Description</label>
            <FormControl componentClass="textarea"
                         dir={stringUtils.getStringTypingDirection(sourceIso)}
                         ref="description"
                         onChange={ (e) => {
                           self.setFieldValue('description', e)
                         } }/>
          </FormGroup>
          <div className="m-t-20">
            <button className="btn btn-default" onClick={ () => {
              self.props.toggleNewGlossary()
            }}>Close</button>
            <button className="btn btn-info pull-right" onClick={ () => {
              self.saveNewGlossary()
            }}>Save</button>
          </div>
        </Modal.Body>
      </Modal>
    )
  }

}
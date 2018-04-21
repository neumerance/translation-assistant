import React, { Component } from 'react';
import * as _ from 'lodash';
import { InputGroup, SplitButton, MenuItem } from 'react-bootstrap';
import Notify from '../../../../constants/notify'
const notify = new Notify();
import GlossaryApiRequests from '../../../../services/requests/glossary_api_request';
const api = new GlossaryApiRequests();

export default class GlossaryItemEditableRow extends Component {
  constructor(props) {
    super(props);
    this.state = {
      currentGlossaryItem: {},
      originalGlossaryItem: {},
      showDescriptionField: false,
      showTranslatedTextField: false
    }
  };

  componentWillMount() {
    this.setState({
      currentGlossaryItem: this.props.glossaryItem,
      originalGlossaryItem: _.cloneDeep(this.props.glossaryItem)
    });
  };

  componentWillReceiveProps(nextProps) {
    this.setState({
      currentGlossaryItem: nextProps.glossaryItem,
      originalGlossaryItem: _.cloneDeep(nextProps.glossaryItem)
    });
  };

  toggleField(field) {
    const self = this;
    const state = self.state;
    self.state[field] = !self.state[field]
    self.setState(state, () => {
      self.saveCurrentGlossaryItem();
    });
  }

  setFieldValue(field, input) {
    const self = this;
    this.state.currentGlossaryItem[field] = input.target.value;
    this.setState({
      currentGlossaryItem: this.state.currentGlossaryItem
    });
  };

  saveCurrentGlossaryItem() {
    const self = this;
    const cmsData = self.props.cmsData;
    const params = {
      id: this.state.currentGlossaryItem.id,
      cms_request_id: _.get(cmsData, 'id', ''),
      target_language_id: _.get(cmsData, 'target_language.id', '')
    };

    if(this.isTranslationChanged()){
      params.translation = this.state.currentGlossaryItem.translated_text;
    }

    if(this.isDescriptionChanged()){
      params.description = this.state.currentGlossaryItem.description;
    }

    api.updateGlossaryItem(params.id, params, () => {
      this.setState({
        currentGlossaryItem: _.cloneDeep(this.state.currentGlossaryItem),
        originalGlossaryItem: _.cloneDeep(this.state.currentGlossaryItem)
      });
    }, () => {
      this.setState({currentGlossaryItem: _.cloneDeep(this.state.originalGlossaryItem)});
      notify.warning('Error', `Error on saving "${this.state.currentGlossaryItem.term}"`);
    });
  };

  restoreOriginalGlossaryItem() {
    this.setState({currentGlossaryItem: _.cloneDeep(this.state.originalGlossaryItem)});
  };

  onKeyPress(event) {
    if (!this.canSave()) return;
    if (event.key == 'Enter') this.saveCurrentGlossaryItem();
    if (event.key == 'Escape') this.restoreOriginalGlossaryItem();
  };

  isChanged() {
    return (this.isTranslationChanged() || this.isDescriptionChanged());
  };

  isValid() {
    return !_.isEmpty(this.state.currentGlossaryItem.translated_text) &&
      !_.isEmpty(this.state.currentGlossaryItem.description)
  }

  canSave() {
    return this.isValid() && this.isChanged()
  }

  isTranslationChanged() {
    return (this.state.currentGlossaryItem.translated_text != this.state.originalGlossaryItem.translated_text);
  };

  isDescriptionChanged() {
    return (this.state.currentGlossaryItem.description != this.state.originalGlossaryItem.description);
  }

  rowCssCLass() {
    return `glossary-item-editable-row ${ this.isChanged() ? 'changed' : 'original' }`
  };

  render() {
    const self = this;
    const glossaryItem = self.state.currentGlossaryItem;

    return(
      <tr className={ self.rowCssCLass() }>
        <td className="width-25">
          { glossaryItem.term }
        </td>
        <td className="width-25">
          <a href="javascript:void(0)"
             className={`term ${self.state.showDescriptionField ? 'hide' : 'show'}`}
             onClick={() => { self.toggleField('showDescriptionField') }}>{self.state.currentGlossaryItem['translated_text']}</a>
          <input type="text"
                 className={`form-control ${self.state.showDescriptionField ? 'show' : 'hide'}`}
                 value={ glossaryItem.translated_text }
                 onKeyUp={ (e) => { self.onKeyPress(e) } }
                 onBlur={() => { self.toggleField('showDescriptionField') }}
                 onChange={ (e) => { self.setFieldValue('translated_text', e) } }/>
        </td>
        <td className="width-40">
          <a href="javascript:void(0)"
             className={`term ${self.state.showTranslatedTextField ? 'hide' : 'show'}`}
             onClick={() => { self.toggleField('showTranslatedTextField') }}>{self.state.currentGlossaryItem['description']}</a>
          <input type="text" value={ glossaryItem.description }
                 className={`form-control ${self.state.showTranslatedTextField ? 'show' : 'hide'}`}
                 onKeyUp={ (e) => { self.onKeyPress(e) } }
                 onBlur={() => { self.toggleField('showTranslatedTextField'); }}
                 onChange={ (e) => { self.setFieldValue('description', e) } }/>
        </td>
        <td className="width-10">
          <button className="hide btn btn-danger btn-xs">
            <i className="fa fa-trash"></i>
          </button>
        </td>
      </tr>
    )
  };
}

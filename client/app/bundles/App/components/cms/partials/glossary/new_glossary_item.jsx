import React, { Component } from 'react';
import { FormControl } from 'react-bootstrap';
import GlossaryApiRequests from '../../../../services/requests/glossary_api_request';
const api = new GlossaryApiRequests();

export default class NewGlossaryItem extends Component {
  constructor(props) {
    super(props);
    this.state = {
      item: {
        term: '',
        description: '',
        translated_text: ''
      }
    };
  };

  componentWillReceiveProps(props) {
    const self = this;
    if (props.dispatchSave && self.props.dispatchSave != props.dispatchSave && self.props.showNewForm) self.saveNewGlossaryItem();
  }

  setFieldValue(field, event) {
    this.state.item[field] = event.target.value;
    this.setState({item: this.state.item});
  };

  saveNewGlossaryItem() {
    const self = this;
    const app = self.props.app;
    api.createGlossary(app.params.id, self.state.item, () => {
      api.getGlossary(app.params.id);
      self.setState({item: {
        term: '',
        description: '',
        translated_text: '' }
      }, () => {
        self.props.toggleSaveDispatch();
      });
    });
  };

  isButtonDisabled() {
    return (_.isEmpty(this.state.item.term) || _.isEmpty(this.state.item.description)
             || _.isEmpty(this.state.item.translated_text))
  }

  render() {
    const self = this;
    let tr = <tr></tr>
    if (self.props.showNewForm) {
      tr = <tr>
        <td className="width-25">
          <FormControl componentClass="input"
                       placeholder="Term"
                       className="pull-left"
                       ref="term"
                       value = { self.state.item.term }
                       onChange={ (e) => { self.setFieldValue('term', e) } } />
        </td>
        <td className="width-25">
          <FormControl componentClass="input"
                       placeholder="Translation"
                       className="pull-left"
                       ref="translated_text"
                       value = { self.state.item.translated_text }
                       onChange={ (e) => { self.setFieldValue('translated_text', e) } } />
        </td>
        <td className="width-45">
          <FormControl componentClass="input"
                       className="description pull-left"
                       placeholder="Description"
                       ref="description"
                       value = { self.state.item.description }
                       onChange={ (e) => { self.setFieldValue('description', e) } } />
        </td>
        <td className="width-5 text-center">
          <a className="closeLink" onClick={() => { self.props.toggleNewForm() } }><i className="fa fa-times"></i></a>
        </td>
      </tr>
    }
    return(tr)
  };
};

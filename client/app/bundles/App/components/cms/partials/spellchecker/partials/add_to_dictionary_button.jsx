import React, {Component} from 'react';
import SpellCheckFilterItem from './spellcheck_filter_item';
import * as _ from 'lodash';
import Notify from '../../../../../constants/notify';

const store = localStorage;
const notify = new Notify();

export default class AddToDictionaryButton extends Component {

  constructor(props) {
    super(props);
    this.state = {
      dictionaryName: '',
      string: '',
      defaultKey: makeid()
    }
  }

  componentWillReceiveProps(props) {
    const self = this;
    const cmsData = self.props.cmsData;
    self.setState({
      string: props.currentWord,
      dictionaryName: `dictionaries_${_.get(cmsData, 'target_language.name', '')}`
    });
  }

  getDictionaries() {
    const self = this;
    let result = [];
    console.log('self.state.dictionaryName', self.state.dictionaryName);
    const currentDictionary = store[self.state.dictionaryName];
    if (currentDictionary) result = JSON.parse(currentDictionary).data
    return result;
  }

  updateDictionary(newDictionary = [], callback = () => {}) {
    const self = this;
    store[self.state.dictionaryName] = JSON.stringify({data: newDictionary});
    this.setState({
      string: '',
      defaultKey: makeid()
    }, () => {
      callback();
    })
  }

  isASpellcheckedWord() {
    return this.props.currentWord == this.state.string;
  }

  dispatchNotification(message = '', attachmentSelector = '#stringField', position = 'top left') {
    notify.error(
      'Invalid word',
      message,
      true, attachmentSelector, position
    );
  }

  hasExists() {
    const self = this;
    let result = false;
    const dictionaries = self.getDictionaries();
    if (_.includes(dictionaries, self.state.string.toLowerCase())) {
      self.dispatchNotification('Word is already exists.');
      result = true;
    }
    return result;
  }

  hasValidLength() {
    const self = this;
    let result = true;
    let message = null;
    if (!self.state.string) message = 'Word should not be blank.';
    if (_.get(self.state, 'string.length', 0) > 25) message = 'Word should not exceed 25 characters.';
    if (message) {
      self.dispatchNotification(message);
      result = false;
    }
    return result;
  }

  isASingleWord() {
    const self = this;
    let result = true;
    if (self.state.string.split(' ').length > 1) {
      self.dispatchNotification('Should be a single word');
      result = false;
    }
    return result;
  }

  addToDictionary() {
    const self = this;
    if (!self.hasValidLength() || self.hasExists() || !self.isASingleWord()) return;
    const currentDictionaries = self.getDictionaries();
    currentDictionaries.push(self.state.string.toLowerCase());
    let callback = () => {};
    if (self.isASpellcheckedWord()) callback = self.props.processWord
    self.updateDictionary(currentDictionaries, callback);
  }

  removeToDictionary(idx) {
    const self = this;
    const dictionaries = self.getDictionaries();
    _.pullAt(dictionaries, [idx]);
    self.updateDictionary(dictionaries);
  }

  render() {
    const self = this;
    return (
      <span className={`fa fa-plus pull-right hand-cursor line-height-20 ${this.props.showPanel ? 'show' : 'hide'}`} onClick={ self.addToDictionary.bind(this) }></span>
    )
  }

}
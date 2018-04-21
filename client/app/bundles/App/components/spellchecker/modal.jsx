import React, { PropTypes } from 'react';
import {Modal} from 'react-bootstrap';
import {Scrollbars} from 'react-custom-scrollbars';
import ToggleButton from 'react-toggle-button';
import {WordsScanner} from "../../services/glossary/words_scanner";
import WebtaSpellcheckerUserDictionary from '../../adapters/webta_spellchecker/user_dictionary';
import WebtaSpellcheckerUserDictionaryTable from './user_dictionary_table';
import * as _ from 'lodash';
import * as stringUtils from '../../services/utils/string_utils';

const RegexBuilder = new WordsScanner();

const nullFunc = () => {};

class WebtaSpellcheckerModal extends React.Component {

  constructor(props) {
    super(props);
    this.userDictionary = new WebtaSpellcheckerUserDictionary(this.props.lang);
    this.state = {
      dictionaryMode: false,
      processedWords: [],
      data: [],
      currentWord: null
    }
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.data) {
      if (nextProps.data.length) {
        this.setState({
          data: nextProps.data,
          currentWord: nextProps.data[0]
        });
      }
    }
  }

  renderWord(data = [], onClick = nullFunc) {
    const dir = stringUtils.getStringTypingDirection(this.props.lang);
    const currentWord = _.get(this.state.currentWord, 'word', null);
    return data.map((datum, idx) => {
      let actionBtn = null;
      const itemClass = ['list-group-item text-left p-4-10', dir];
      if (currentWord) {
        if (datum.word) {
          const isCurrentWord = (datum.word.toLowerCase() === currentWord.toLowerCase());
          if (isCurrentWord) {
            itemClass.push('active');
            if (this.state.dictionaryMode) {
              actionBtn = <span className="pull-right fa fa-plus m-l-10 font-20"
                                onClick={ () => {this.addToDictionary(datum.word)}}>
                          </span>
            }
          }
        } else if (typeof datum == 'string') {
          if (datum.toLowerCase() === currentWord.toLowerCase()) { itemClass.push('active'); }
        } else {
          return null;
        }
      }

      return (
        <a href="javascript:void(0)" key={ idx }
           onClick={ () => { onClick(datum) } }
           className={ itemClass.join(' ') }>
          {datum.word ? datum.word : datum}
          {actionBtn}
        </a>
      )
    });
  }

  renderMisspelledWords() {
    return this.renderWord(
      this.getWords(),
      this.setCurrentWord.bind(this)
    );
  }

  renderSuggestedWords() {
    return this.renderWord(
      this.getSuggestedWords(),
      this.correctWords.bind(this)
    );
  }

  renderDictionaryTable() {
    if(this.state.dictionaryMode) {
      return(
        <div className="row">
          <div className="col-md-12">
            <WebtaSpellcheckerUserDictionaryTable lang={this.props.lang} />
          </div>
        </div>
      )
    } else {
      return null;
    }
  }

  render() {
    return (
      <Modal id="spellcheck-modal" bsSize="large" show={this.props.showSpellCheckModal}>
        <Modal.Header>
          <Modal.Title>Spell Check</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="row">
            <div className="col-md-4">
              <h5 className="text-center">Misspelled word</h5>
              <Scrollbars autoHide
                          autoHeight
                          autoHeightMin={0}
                          autoHeightMax={300}>
                <div className="list-group">
                  {this.renderMisspelledWords()}
                </div>
              </Scrollbars>
            </div>
            <div className="col-md-4">
              <h5 className="text-center">Suggested corrections</h5>
              <Scrollbars autoHide
                          autoHeight
                          autoHeightMin={0}
                          autoHeightMax={300}>
                <div className="list-group">
                  {this.renderSuggestedWords()}
                </div>
              </Scrollbars>
            </div>
            <div className="col-md-4">
              <h5 className="text-center">Action</h5>
              <button className="btn btn-default btn-sm btn-block"
                      onClick={ this.processWord.bind(this) }>
                Ignore this word
              </button>
              <button className="btn btn-default btn-sm btn-block"
                      onClick={ this.ignoreAllAndSave.bind(this) }>
                Ignore all and save
              </button>
              <label className="m-t-10">
                <div className="display-inline m-r-5">
                  <ToggleButton
                    value={ this.state.dictionaryMode }
                    onToggle={() => {
                      this.setState({ dictionaryMode: !this.state.dictionaryMode })
                    }}
                  />
                </div>
                <div className="display-inline">
                  Use dictionary
                </div>
              </label>
            </div>
          </div>
          {this.renderDictionaryTable()}
        </Modal.Body>
        <Modal.Footer>
          <button className="btn btn-default btn-sm pull-left" onClick={this.props.toggleModal.bind(this)}>Cancel
          </button>
        </Modal.Footer>
      </Modal>
    )
  }

  getWords() {
    const data = this.state.data;
    _.pullAllBy(data, this.state.processedWords, 'word');
    return data;
  }

  getSuggestedWords() {
    const current = this.state.currentWord;
    if (!current) return [];
    return current.suggestions;
  }

  getCurrentWord() {
    if (!this.state.currentWord) return null;
    return this.state.currentWord.word;
  }

  processWord() {
    const processedWords = this.state.processedWords;
    processedWords.push(this.state.currentWord);
    this.setState({processedWords});
    this.setNextCurrentWord();
  }

  correctWords(correction) {
    const re = RegexBuilder.stringRegexp(this.state.currentWord.word);
    const sentence = this.props.getContent();
    const updatedSentence = sentence.replace(re, correction);
    this.props.setContent(updatedSentence);
    this.processWord();
  }

  setCurrentWord(currentWord = {}) {
    this.setState({ currentWord });
  }

  setNextCurrentWord() {
    let index = 0;
    const data = this.getWords();
    if (this.state.currentWord) {
      console.log('data', data);
      index = _.findIndex(data, (x) => {
        this.state.currentWord.word.toLowerCase() === x.word.toLowerCase()
      });
    }
    const nextIndex = index + 1;
    if (index && data[nextIndex]) {
      this.setState({currentWord: data[nextIndex]});
    } else {
      this.setState({
        suggestedWords: [],
        currentWord: null,
        processedWords: []
      }, () => {
        this.props.toggleModal();
        this.props.saveContent();
      });
    }
  }

  ignoreAllAndSave() {
    this.props.toggleModal();
    this.props.saveContent();
  }

  addToDictionary(word) {
    this.userDictionary.addToDictionary(word);
    this.processWord();
  }
}

// WebtaSpellcheckerModal.propTypes = {
//   showSpellCheckModal: PropTypes.bool.isRequired(),
//   data: PropTypes.array.isRequired(),
//   lang: PropTypes.string.isRequired()
// }

export default WebtaSpellcheckerModal;
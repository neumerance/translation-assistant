import React, {Component} from 'react';
import {Modal, Popover} from 'react-bootstrap';
import {Scrollbars} from 'react-custom-scrollbars';
import * as _ from 'lodash';
import {WordsScanner} from '../../../../services/glossary/words_scanner';
import SpellCheckApiRequest from '../../../../services/requests/spellcheck_api_request';
import SpellCheckFilter from './partials/spellcheck_filter';
import ToggleButton from 'react-toggle-button';
import AddToDictionaryButton from "./partials/add_to_dictionary_button";
import * as stringUtils from '../../../../services/utils/string_utils';

const api = new SpellCheckApiRequest();
const wordscanner = new WordsScanner();

export default class SpellcheckModal extends Component {

  constructor(props) {
    super(props);
    this.state = {
      currentWordIndex: 0,
      words: [],
      processedWords: [],
      suggestedWords: [],
      dictionaryMode: false
    }
  }

  componentWillReceiveProps(nextProps) {
    const self = this;
    const props = self.props;
    const cmsData = self.props.cmsData;

    if (props.showSpellCheckModal != nextProps.showSpellCheckModal && nextProps.showSpellCheckModal) {
      self.setState({
        words: [],
        suggestedWords: []
      }, () => {
        const sentence = props.editorController.getUserContent();
        api.spellCheckSentence(_.get(cmsData, 'target_language', ''), sentence, (data) => {
          if (!data.length) {
            self.props.saveSentence();
            self.props.toggleSpellChecker();
            return;
          }
          self.setState({ words: data }, () => {
            self.selectWord(0, data[0]);
          });
        });
      });
    }
  }

  processWord(wordIdx) {
    const self = this;
    const words = self.state.words;
    const word = words[wordIdx];
    const processedWords = self.state.processedWords;
    processedWords.push(word);
    _.pullAt(words, [wordIdx]);
    self.setState({
      word: words,
      processedWords: processedWords
    }, () => {
      if (self.state.words.length) {
        self.selectWord(0, self.state.words[0]);
      } else {
        self.setState({
          suggestedWords: []
        });
        self.props.saveSentence();
        self.props.toggleSpellChecker();
      }
    });
  }

  selectWord(index, word) {
    const self = this;
    const cmsData = self.props.cmsData;
    const iso = _.get(cmsData, 'target_language.iso', '');
    self.setState({
      currentWordIndex: index,
      suggestedWords: []
    }, () => {
      api.spellCheckWordSuggestions(iso, word, (data) => {
        self.setState({ suggestedWords: data })
      });
    });
  }

  correctWords(word, correction) {
    const self = this;
    const re = wordscanner.stringRegexp(word);
    const sentence = self.props.editorController.getUserContent();
    const updatedSentence = sentence.replace(re, correction);
    self.props.editorController.setContent(updatedSentence);
  }

  correctWord(word_correction) {
    const self = this;
    const word = self.state.words[self.state.currentWordIndex];
    if (word) {
      self.correctWords(word, word_correction);
      self.processWord(self.state.currentWordIndex);
    }
  }

  suggestionList() {
    const self = this;
    const iso = _.get(this.props.cmsData, 'target_language.iso', '');
    const dir = stringUtils.getStringTypingDirection(iso);
    if (_.isEmpty(self.state.suggestedWords)) {
      return <span className='no-suggestions'>No suggestion</span>;
    }
    const suggestionList = _.slice(self.state.suggestedWords, 0, 2).map((word, idx) => {
      return (
        <a key={ idx }
           href="javascript:void(0)"
           onClick={ () => {
             self.correctWord(word)
           } }
           className={`list-group-item text-left p-4-10 ${dir}`}>{word}</a>
      )
    });

    return suggestionList;
  }

  createPopover(id, title, content) {
    const popover = (
      <Popover id={id} title={title}>
        {content}
      </Popover>
    );
    return popover;
  }

  setDictionaryMode(value) {
    this.setState({ dictionaryMode: !value })
  }

  render() {
    const self = this;
    const iso = _.get(this.props.cmsData, 'target_language.iso', '');
    const dir = stringUtils.getStringTypingDirection(iso);
    const correction_lists = self.state.words.map((word, idx) => {
      const itemClass = ['list-group-item text-left p-4-10', dir];
      if (self.state.currentWordIndex == idx) {
        itemClass.push('active')
      }
      return (
        <a href="javascript:void(0)" key={ idx }
           onClick={ () => {
             self.selectWord(idx, word)
           } }
           className={ itemClass.join(' ') }>
          {word}
          <AddToDictionaryButton  cmsData={self.props.cmsData}
                                  showPanel={self.state.dictionaryMode}
                                  addClass="m-t-10"
                                  processWord={() => { self.processWord(idx) }}
                                  currentWord={word} />
        </a>
      )
    });

    return (
      <Modal id="spellcheck-modal" bsSize="large" show={self.props.showSpellCheckModal && self.state.words.length > 0}>
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
                  { correction_lists }
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
                  { self.suggestionList() }
                </div>
              </Scrollbars>
            </div>
            <div className="col-md-4">
              <h5 className="text-center">Action</h5>
              <button className="btn btn-default btn-sm btn-block"
                      onClick={ () => {
                        self.processWord(self.state.currentWordIndex)
                      } }>Ignore this word
              </button>
              <label className="m-t-10">
                Dictionary Mode <ToggleButton value={self.state.dictionaryMode} onToggle={(value) => { self.setDictionaryMode(value) }} />
              </label>
            </div>
          </div>
          <div className="row">
            <div className="col-md-12">
              <SpellCheckFilter dir={dir}
                                cmsData={self.props.cmsData}
                                showPanel={self.state.dictionaryMode}
                                addClass="m-t-10"
                                processWord={() => { self.processWord(self.state.currentWordIndex) }}
                                currentWord={self.state.words[self.state.currentWordIndex]} />
            </div>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <button className="btn btn-default btn-sm pull-left" onClick={ self.props.toggleSpellChecker }>Cancel
          </button>
        </Modal.Footer>
      </Modal>
    )
  }

}
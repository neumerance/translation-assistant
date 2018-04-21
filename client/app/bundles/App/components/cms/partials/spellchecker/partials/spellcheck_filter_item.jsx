import React, {Component} from 'react';
import * as _ from 'lodash';

export default class SpellCheckFilterItem extends Component {

  constructor(props) {
    super(props);
    this.state = {
      fieldIsActive: false,
      word: ''
    }
  }

  componentDidMount() {
    const self = this;
    self.setState({ word: self.props.word });
  }

  toggleField() {
    const self = this;
    self.setState({fieldIsActive: !self.state.fieldIsActive}, () => {
      _.get(self.refs, `field`).focus();
    });
  }

  onChange(e) {
    const self = this;
    self.setState({ word: e.target.value.toLowerCase() });
  }

  save() {
    const self = this;
    const wordIndex = self.props.index;
    const dictionary = self.props.getDictionaries();
    dictionary.splice(wordIndex, 1, self.state.word);
    self.props.updateDictionary(dictionary, self.toggleField());
  }

  render() {
    const self = this;
    return (
      <div>
        <a href="javascript:void(0)"
           className={`${this.props.dir} ${self.state.fieldIsActive ? 'hide' : 'show'}`}
           onClick={self.toggleField.bind(this)}>{self.state.word}</a>
        <input type="text"
               value={self.state.word}
               onBlur={self.save.bind(this)}
               ref="field"
               onChange={(e) => {self.onChange(e)}}
               className={`form-control ${self.state.fieldIsActive ? 'show' : 'hide'}`} />
      </div>
    )
  }

}
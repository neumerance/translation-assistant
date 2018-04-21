import React, {Component} from 'react';
import * as stringUtils from '../../../../services/utils/string_utils';
import * as  _ from 'lodash';

export default class GlossaryItems extends Component {

  constructor(props) {
    super(props);
    this.state = {
      glossary: {},
      term: true,
      translatedText: true,
      description: true
    }
  }

  componentWillReceiveProps(props) {
    const self = this;
    self.setState({ glossary: props.glossary });
  }

  onChange(field, e) {
    const self = this;
    const glossary = self.state.glossary;
    _.set(glossary, field, e);
    self.setState({glossary: glossary}, () => {
      self.props.setGlossaryValues(self.props.glossaryIndex, glossary);
    });
  }

  getText(field) {
    const self = this;
    let blankText = field;
    if (field == 'translated_text') blankText = 'Translation'
    const text = _.get(self.state.glossary, field, null);
    const preview = text || <span>{_.capitalize(blankText)}</span>;
    const styles = {};
    if (!text) styles.color = '#8e8e8e';
    return <a className={self.state[_.camelCase(field)] ? 'show' : 'hide'}
              onClick={() => {self.togglePreviewAndInput(field)}}
              href="javascript:void(0)" style={styles}>{preview}</a>
  }

  hasID() {
    return !!this.state.glossary.id
  }

  renderTdContent(field) {
    const self = this;
    const preview = self.getText(field);
    const text = _.get(self.state.glossary, field, '')
    const fieldState = self.state[_.camelCase(field)];
    const input = <input className={`form-control ${(fieldState ? 'hide' : 'show')}`}
                         value={text || ''}
                         ref={_.camelCase(field)}
                         onBlur={() => {self.togglePreviewAndInput(field)}}
                         onChange={(e) => { self.onChange(field, e.target.value) }} />
    return (
      <div>
        {preview}
        {input}
      </div>
    )
  }

  togglePreviewAndInput(field) {
    const self = this;
    const state = self.state;
    const fieldName = _.camelCase(field);
    _.set(state, fieldName, !state[fieldName]);
    self.setState(state, () => {
      _.get(self.refs, `${_.camelCase(field)}`).focus();
    });
  }

  render() {
    const self = this;
    const cmsData = self.props.cmsData;
    const targetIso = _.get(cmsData, 'target_language.iso', 'en');
    const sourceIso = _.get(cmsData, 'source_language.iso', 'en');
    let action = null;
    if (!self.state.glossary.id) action = <td className="width-10 text-center">
      <a href="javascript:void(0)" className="closeLink" onClick={() => { self.props.removeRow(self.props.glossaryIndex) } }><i className="fa fa-trash"></i></a>
    </td>

    return(
      <tr>
        <td className="width-25" dir={stringUtils.getStringTypingDirection(sourceIso)}>
          {self.hasID() ? _.get(self.state.glossary, 'term', null) : self.renderTdContent('term')}
        </td>
        <td className="width-25"  dir={stringUtils.getStringTypingDirection(targetIso)}>
          {self.renderTdContent('translated_text')}
        </td>
        <td colSpan={self.state.glossary.id ? 2 : 1} className={self.state.glossary.id ? 'width-50' : 'width-40'}  dir={stringUtils.getStringTypingDirection(sourceIso)}>
          {self.renderTdContent('description')}
        </td>
        {action}
      </tr>
    )
  }

}
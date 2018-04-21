import React, {Component} from 'react';
import {Popover, OverlayTrigger} from 'react-bootstrap';
import keyMap, {shortcutKeyToClass, keyLabelFromMap} from '../../../../constants/hotkey_configs';
import * as _ from 'lodash';
import * as countryUtils from '../../../../services/utils/country';
import * as stringUtils from '../../../../services/utils/string_utils';

import NewGlossaryModal from './new_glossary_modal';

export default class GlossaryList extends Component {

  render() {
    const self = this;
    const cmsData = self.props.cmsData;
    const targetIso = _.get(cmsData, 'target_language.iso', 'en');
    const sourceIso = _.get(cmsData, 'source_language.iso', 'en');

    let originalLanguage = null;
    let targetLanguage = null;
    let glossaries = (
      <tr>
        <td colSpan={4}>No glossary found for this sentence.</td>
      </tr>
    );

    if (cmsData) {
      originalLanguage = _.get(cmsData, 'source_language.name', '');
      targetLanguage = _.get(cmsData, 'target_language.name', '');
    }

    if (self.props.glossaries.length) {
      glossaries = self.props.glossaries.map((glossary, idx) => {
        const actionKey = `INSERT_GLOSSARY_TERM_${idx}`;
        const popoverContent = <div><small>{keyLabelFromMap('EDITOR', actionKey)}</small></div>;
        const overlayContent = self.createPopover(`clearPopover_${actionKey}`, null, popoverContent);

        return (
          <tr key={idx}>
            <td className="width-30 dont-break-out" dir={stringUtils.getStringTypingDirection(sourceIso)}>{_.capitalize(glossary.term)}</td>
            <td className="width-30 dont-break-out" dir={stringUtils.getStringTypingDirection(targetIso)}>{_.capitalize(glossary.translated_text)}</td>
            <td className="width-30 dont-break-out" dir={stringUtils.getStringTypingDirection(sourceIso)}>{_.upperFirst(glossary.description)}</td>
            <td className="width-10 dont-break-out">
              <OverlayTrigger trigger={ ['hover', 'focus'] }
                              placement="top"
                              overlay={ overlayContent }>
                <button className={ `btn btn-info btn-xs ${shortcutKeyToClass(keyMap['EDITOR'][actionKey])}` }
                        onClick={ () => {
                          self.props.insertTermToEditor(glossary.translated_text)
                        } }>Insert
                </button>
              </OverlayTrigger>
            </td>
          </tr>
        )
      });
    }

    let content = null;
    if (self.props.isShown) {
      content = <div className="sentenceGlossary absolute top width-full grey-border light-shadow p-10">
        <table className="table table-slim table-striped vertical-middle-table">
          <thead>
          <tr>
            <th colSpan="3"><label><i className="fa fa-book"></i> Glossary</label></th>
            <th>
              <button className={'btn btn-xs btn-success m-r-5'}
                      onClick={() => {
                        self.props.toggleNewGlossary()
                      }}>Add New
              </button>
            </th>
          </tr>
          <tr>
            <th className="width-30">
              <span className={`flag-icon flag-icon-${countryUtils.getCountryFlag(originalLanguage)} m-r-5`}></span> {_.upperFirst(originalLanguage)}
            </th>
            <th className="width-30">
              <span className={`flag-icon flag-icon-${countryUtils.getCountryFlag(targetLanguage)} m-r-5`}></span> {_.upperFirst(targetLanguage)}
            </th>
            <th className="width-30">Description</th>
            <th className="width-10"></th>
          </tr>
          </thead>
          <tbody>
          {glossaries}
          </tbody>
        </table>

        <NewGlossaryModal app={ self.props.containerProps.app }
                          cmsData={ cmsData }
                          showNewGlossaryModal={ self.props.showNewGlossary }
                          toggleNewGlossary={ ()=> { self.props.toggleNewGlossary() } }
                          getAllGlossaries={ self.props.containerProps.getAllGlossaries } />
      </div>
    }

    return (
      <div className={'relative ' + (self.props.isShown ? '' : 'hide')} style={{zIndex: 8}}>
        {content}
      </div>
    )
  }

  createPopover(id, title, content) {
    const popover = (
      <Popover id={id} title={title}>
        {content}
      </Popover>
    );
    return popover;
  }
}
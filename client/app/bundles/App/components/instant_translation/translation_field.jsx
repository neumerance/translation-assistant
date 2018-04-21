import React, { PropTypes } from 'react';
import { Link } from 'react-router'
import { FormControl, FormGroup } from 'react-bootstrap'
import { iso_lang_hash } from '../../services/utils/app_constants'

class InstantTranslationTranslationField extends React.Component {

    setTranslation(e) {
        const self = this
        const app = self.props.app
        const action = app.actions.it_actions
        const instant_translation = self.props.instant_translation
        instant_translation.visitor_body = e.target.value
        action.dispatchInstantTranslation(instant_translation)
    }

    setSpellChecker(iso) {
        const self = this
        const instance = new $.SpellChecker('#spellCheckField', {
                          lang: iso,
                          parser: 'text',
                          webservice: {
                            path: 'https://apitest.icanlocalize.com/SpellChecker.php',
                            driver: 'pspell'
                          },
                          suggestBox: {
                            position: 'above'
                          },
                          incorrectWords: {
                            container: '#incorrect-word-list'
                          }
                        })
        return instance
    }

    checkSpelling(instance) {
      const self = this
      instance.check()
    }

    render() {
        let field = null
        const self = this
        if (self.props.instant_translation) {
            $('#incorrect-word-list').html('')
            const instance = self.setSpellChecker(iso_lang_hash[self.props.instant_translation.visitor_language_id].iso)
            instance.check()
            field = <FormGroup>
                        <FormControl id="spellCheckField"
                                     componentClass="textarea" 
                                     style={{ height: 120 }} 
                                     defaultValue={ self.props.instant_translation.visitor_body } 
                                     onBlur={ (e) => { self.setTranslation(e) } }
                                     onChange={ self.checkSpelling.bind(this, instance) }
                        />
                        <div id="incorrect-word-list"></div>
                    </FormGroup>
        }
        return (
            <div>
                { field }
            </div>
        )
    }
}

export default InstantTranslationTranslationField;

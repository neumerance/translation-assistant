import React from 'react';
import { CleanLocalizationClient as t } from "../clean_localization/client";

class InstantTranslationIndex extends React.Component {

  render() {
    let token = `{{T:1}}`;
    return (
      <div className="row" dangerouslySetInnerHTML={{
        __html: t.t('instant_translation.intro', { tokenFormat: token })
      }}>
      </div>
    );
  }
}

export default InstantTranslationIndex;

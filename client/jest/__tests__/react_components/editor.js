import React from 'react';

import OtgsWebtaEditor from '../../../app/bundles/App/components/cms/partials/text_editor/otgs_webta_editor/editor';
import renderer from 'react-test-renderer';

it('renders', () => {
  let originalString = 'hello string';
  let editorController = {
    outerDom: {
      editorCssId: 'test-css-id'
    },
    prepare: ()=> {}
  };
  let dbid = 1;
  let colorSelectionData = {};
  let xtagTokenData = {};

  const component = renderer.create(
    <OtgsWebtaEditor originalString={ originalString }
                     controller={ editorController }
                     dbid={ dbid }
                     colorSelectionData={ colorSelectionData }
                     xtagTokenData={ xtagTokenData }
    />
  );

  const json = component.toJSON();
  expect(json).toMatchSnapshot();
});


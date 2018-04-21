'use strict';
import {OtgsWebtaEditorVisibleSpace} from 'components/cms/partials/text_editor/otgs_webta_editor/editor/visible_space'
import JestSupportConfig from 'support/config';

describe('#convertElementToVisibleSpaces', ()=>{
  JestSupportConfig.setGlobals();

  const testConversion = (original, converted)=> {
    const convertedContent = OtgsWebtaEditorVisibleSpace.convertElementToVisibleSpaces(original);
    expect(convertedContent).toEqual(converted);
  };

  it('converts string', () => {
    testConversion('Hello my Friend', 'Hello&#9679;my&#9679;Friend')
  });

  it('converts simple HTML', () => {
    testConversion('Hello<a> my</a> Friend', 'Hello<a>&#9679;my</a>&#9679;Friend')
  });

  it('converts nested HTML', () => {
    testConversion('Hello<p><a> my</a></p> Friend', 'Hello<p><a>&#9679;my</a></p>&#9679;Friend')
  });
});

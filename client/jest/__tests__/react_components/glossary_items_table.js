'use strict';

import JestSupportConfig from '../../support/config';
JestSupportConfig.setGlobals();

import React from 'react';
import GlossaryItemsTable from '../../../app/bundles/App/components/layouts/main_menu';
import renderer from 'react-test-renderer';

const router = {
  location: {
    pathname: {
      match: ()=>{ return true }
    }
  }
};

it('renders', () => {
  const component = renderer.create(
    <GlossaryItemsTable router={router}/>
  );

  const json = component.toJSON();
  expect(json).toMatchSnapshot();
});

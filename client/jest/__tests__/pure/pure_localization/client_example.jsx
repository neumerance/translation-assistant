'use strict';

import {CleanLocalizationClient} from '../../../../app/bundles/App/components/clean_localization/client';
import JestSupportConfig from "../../../support/config";

it('translates simple key (when missing key)', () => {
  JestSupportConfig.setGlobals();
  const key = 'key';
  const value = CleanLocalizationClient.translate(key);
  expect(value).toEqual('');
});

it('translates simple key (when existing key)', () => {
  JestSupportConfig.setGlobals();
  const key = 'key';
  const dataValue = 'value';

  PureLocalizationDB.data[key] = dataValue;

  const value = CleanLocalizationClient.translate(key);
  expect(value).toEqual(dataValue);
});

it('translates complex key', () => {
  JestSupportConfig.setGlobals();
  const key = 'key';
  const dataValue = 'value is %{first} <b>%{second}</b>!';

  PureLocalizationDB.data[key] = dataValue;

  const value = CleanLocalizationClient.translate(key, { first: 'hello', second: 'world' });
  expect(value).toEqual('value is hello <b>world</b>!');
});

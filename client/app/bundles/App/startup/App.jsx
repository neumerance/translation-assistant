import React from 'react';
import { Provider } from 'react-redux';

import AppStore from '../store/app_store';
import AppRouter from '../routes/router'

const App = (props, _railsContext) => (
  <Provider store={AppStore(props)}>
    <AppRouter />
  </Provider>
);

export default App;

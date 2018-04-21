import React from 'react';
import {Router, Route, IndexRoute, hashHistory} from 'react-router';
import InstantTranslation from '../components/instant_translation/instant_translation';
import AppContainer from '../containers/app_containers';
import CmsIndex from '../components/cms/index';
import CmsShow from '../components/cms/show';
import CmsPreview from '../components/cms/partials/show_component/cms_preview';

// Todo:
// need to upgrade or use other router in the future
// it seems do not support nested router well
export default class AppRouter extends React.Component {
  render() {
    return (
      <Router history={hashHistory}>
        <Route path="/" component={ AppContainer }>
          <IndexRoute name="root" component={ CmsIndex }/>
          <Route exact path="/cms/:id/:type" name="cms_show" component={ CmsShow }/>
          <Route exact path="/cms/:id/:type/preview" name="cms_preview" component={ CmsPreview }/>
          <Route path="/instant_translation(/:id)" name="instant_translation" component={ InstantTranslation }/>
        </Route>
      </Router>
    );
  }
}
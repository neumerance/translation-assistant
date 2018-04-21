import React, {PropTypes} from 'react';
import MainMenu from './main_menu';
import keyMaps from '../../constants/hotkey_configs';
import {ShortcutManager} from 'react-shortcuts';
import ActivityCommitter from '../../services/activity/committer';
import ApplicationComponent from '../application_component';

const shortcutManager = new ShortcutManager(keyMaps);

class AppLayout extends ApplicationComponent {

  componentDidMount() {
    new ActivityCommitter().init();
  }

  getChildContext() {
    return {shortcuts: shortcutManager}
  }

  render() {
    console.log('layout', this.props)
    return (
      <div onClick={() => {
        $('[data-toggle="tooltip"]').tooltip('hide');
      }}>
        <MainMenu router={this.props.router}/>
        {this.props.children && React.cloneElement(this.props.children, {
          app: this.props
        })}
        <div className="text-center pageFooter hide">
          <p className="p-10 m-0">Copyright © 2017 OnTheGoSystems</p>
        </div>
      </div>
    );
  }
}

AppLayout.childContextTypes = {
  shortcuts: PropTypes.object.isRequired
}

export default AppLayout;

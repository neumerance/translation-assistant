import React from 'react'
import { Link } from 'react-router'
import axios from 'axios';
import {CleanLocalizationClient as t} from '../clean_localization/client';

export default class MainMenu extends React.Component {

    constructor(props) {
      super(props);
      this.isActive.bind(this)
    }

    isActive(regex) {
      const router = this.props.router;
      return router.location.pathname.match(regex) ? 'active' : '';
    }

    logout() {
      axios({
        url: '/home/logout',
        data: {
          format: 'json'
        },
        method: 'post'
      }).then(() => {
        location.reload();
      });
    }

    render() {
        const self = this;
        let instantTranslationLink = null;
        if (ApplicationAdapters.config.InstantTranslationEnabled) instantTranslationLink = <ul className="nav navbar-nav">
          <li className={ self.isActive(/^\/instant_translation/) } >
            <Link to="instant_translation">
              {t.translate('dashboard.instant_translation')}
            </Link>
          </li>
        </ul>;

        let appName = <Link className="navbar-brand" to="/">{ApplicationAdapters.config.appName}</Link>;
        if(ApplicationAdapters.config.targetApp == 'ate') appName = <span className="navbar-brand">{ApplicationAdapters.config.appName}</span>;
        return (
            <nav className="navbar navbar-default navbar-static-top">
                <div className="container">
                    <div className="navbar-header">
                        <button type="button" className="navbar-toggle collapsed" data-toggle="collapse" data-target="#bs-example-navbar-collapse-1" aria-expanded="false">
                            <span className="sr-only">Toggle navigation</span>
                            <span className="icon-bar"></span>
                            <span className="icon-bar"></span>
                            <span className="icon-bar"></span>
                        </button>
                        {appName}
                    </div>
                    <div className="collapse navbar-collapse" id="bs-example-navbar-collapse-1">
                      {instantTranslationLink}
                        <ul className="nav navbar-nav pull-right">
                          <li className="dropdown">
                            <a href="#" className="dropdown-toggle" data-toggle="dropdown" role="button" aria-haspopup="true" aria-expanded="false">
                              <span dangerouslySetInnerHTML={{
                                __html: t.t('layout.signed_as', { login: CURRENT_USER.nickname })
                              }} />
                              <span className="caret"></span>
                            </a>
                            <ul className="dropdown-menu pull-right">
                              <li><a href="javascript:void(0)" onClick={self.logout.bind(this)}>Log Out</a></li>
                            </ul>
                          </li>
                        </ul>
                    </div>
                </div>
            </nav>
        );
    }
}
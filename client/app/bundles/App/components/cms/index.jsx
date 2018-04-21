import React from 'react';
import JobTable from './partials/job_table';
import * as browserCheck from '../../services/utils/browser_check';

export default class CmsIndex extends React.Component {

  componentWillMount() {
    const self = this;
    browserCheck.redirectIfNotSupportedBrowser(self.props.app.router);
    if (!ApplicationAdapters.config.JobsIndexEnabled) { window.location = '/notfound' }
  }

  render() {
    return (
      <div className="container">
        <div className="row">
          <div className="col-md-12">
            <JobTable title={`Jobs waiting for your translation`}
                      type="open"
                      expanded={true} />
            <JobTable title={`Jobs waiting for your review`}
                      type="reviews" />
            <JobTable title={`Jobs that you translated and are awaiting review by someone else`}
                      type="waiting_for_review" />
            <JobTable title={`Jobs that you completed review`}
                      type="review_completed" />
            <JobTable title={`Jobs that you completed`}
                      type="completed" />
          </div>
        </div>
      </div>
    );
  }
}
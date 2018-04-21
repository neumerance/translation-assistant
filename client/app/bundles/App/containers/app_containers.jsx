import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import AppLayout from '../components/layouts/layout'
import * as app_actions from '../actions/app_actions'
import * as it_actions from '../actions/instant_translation'
import * as cms_actions from '../actions/cms'

const mapStateToProps = function (state) {
    return {
        instant_translation_jobs: state.ItJobs.instant_translations,
        instant_translation: state.ItJobs.instant_translation,
        open_cms_jobs: state.CmsJobs.open,
        completed_cms_jobs: state.CmsJobs.completed,
        reviews_cms_jobs: state.CmsJobs.reviews,
        waiting_for_review_jobs: state.CmsJobs.waiting_for_review,
        review_completed_jobs: state.CmsJobs.review_completed,
        current_cms_job: state.CmsJobs.current,
        xliff: state.CmsJobs.xliff,
        glossaries: state.CmsJobs.glossaries,
        cms_progress: state.CmsJobs.cms_progress,
        cms_issues: state.CmsJobs.cms_issues,
        cms_spellcheck_conflicts: state.CmsJobs.spellcheck_conflicts,
        cms_spellcheck_suggestion: state.CmsJobs.spellcheck_suggestion,
        cms_issue_count: state.CmsJobs.cms_issue_count,
        cms_preview: state.CmsJobs.cms_preview
    }
}

const mapDispatchToProps = function (dispatch) {
    return {
        actions: {
            app_actions: bindActionCreators(app_actions, dispatch),
            it_actions: bindActionCreators(it_actions, dispatch),
            cms_actions: bindActionCreators(cms_actions, dispatch)
        }
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(AppLayout);

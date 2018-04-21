export default function reducer(state = { open: null, completed: null, reviews: null, waiting_for_review: null, review_completed: null,
                                          current: null, glossaries: [], cms_issues: [], xliff: null, cms_progress: 0,
                                          spellcheck_conflicts: [], spellcheck_suggestion: [],
                                          cms_issue_count: [], cms_preview: null },
                                action) {
    switch (action.type) {
        case 'STORE_OPEN_CMS_JOBS': {
            return {...state, open: action.payload}
        }
        case 'STORE_COMPLETED_CMS_JOBS': {
            return {...state, completed: action.payload}
        }
        case 'STORE_REVIEWS_CMS_JOBS': {
            return {...state, reviews: action.payload}
        }
        case 'STORE_WAITING_FOR_REVIEW_CMS_JOBS': {
            return {...state, waiting_for_review: action.payload}
        }
        case 'STORE_REVIEW_COMPLETED_CMS_JOBS': {
            return {...state, review_completed: action.payload}
        }
        case 'STORE_CMS_JOB': {
            return {...state, current: action.payload}
        }
        case 'STORE_XLIFF': {
            return {...state, xliff: action.payload}
        }
        case 'SET_GLOSSARY': {
            return {...state, glossaries: action.payload}
        }
        case 'SET_PROGRESS': {
            return {...state, cms_progress: action.payload}
        }
        case 'SET_CMS_ISSUES': {
            return {...state, cms_issues: action.payload}
        }
        case 'STORE_CMS_ISSUES_COUNT': {
            return {...state, cms_issue_count: action.payload}
        }
        case 'SET_SPELLCHECK_CONFLICTS': {
            return {...state, spellcheck_conflicts: action.payload}
        }
        case 'SET_SPELLCHECK_SUGGESTIONS': {
            return {...state, spellcheck_suggestion: action.payload}
        }
        case 'SET_CMS_PREVIEW': {
            return {...state, cms_preview: action.payload}
        }
        default:
            return state;
    }
    return state
}
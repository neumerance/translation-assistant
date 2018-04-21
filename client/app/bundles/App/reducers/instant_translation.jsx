export default function reducer(state = {
    instant_translations: {
        open: [],
        in_progress: null
    },
    instant_translation: null,
    error: null
}, action) {
    switch (action.type) {
        case 'GET_IT_JOB': {
            return {...state, instant_translations: action.payload}
        }
        case 'GET_IT_ERROR': {
            return {...state, error: action.payload}
        }
        case 'SHOW_IT_JOB': {
            return {...state, instant_translation: action.payload}
        }
        default:
      		return state;
    }
    return state
}
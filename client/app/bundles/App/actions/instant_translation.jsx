import Notify from '../constants/notify'
import Request from '../constants/request'
import { scrollParentTop } from '../actions/app_actions'
import { hashHistory } from 'react-router'

const notify = new Notify()
const request = new Request()


export function getInstantTranslationJobs(preload = true) {
    return function (dispatch) {
        request.get('its', {}, (response) => {
            dispatch({type: 'GET_IT_JOB', payload: response.data})
        }, preload)
    }
}

export function dispatchInstantTranslation(instant_translation) {
    return function(dispatch) {
        dispatch({type: 'SHOW_IT_JOB', payload: instant_translation})
    }
}

export function showInstantTranslation(id) {
    return function (dispatch) {
        request.get('its/'+id, {}, (response) => {
            dispatch({type: 'SHOW_IT_JOB', payload: response.data})
        })
    }
}

export function takeInstantTranslation(id) {
    return function (dispatch) {
        request.post('its/'+id+'/take', {}, (response) => {
            if(response.data.code == 200) {
                request.get('its/'+id, {}, (response) => {
                    dispatch({type: 'SHOW_IT_JOB', payload: response.data})
                    request.get('its', {}, (response) => {
                        dispatch({type: 'GET_IT_JOB', payload: response.data})
                    })
                })
                scrollParentTop($('#open_jobs_panel > div'), 0)
            } else {
                notify.error('Failed', response.data.message)
            }
        })
    }
}

export function saveInstantTranslation(params) {
    return function (dispatch) {
        request.post('its/'+params.id+'/save', {translations: params.translations}, (response) => {
            if (response.data.code == 200) {
                request.get('its', {}, (response) => {
                    dispatch({type: 'GET_IT_JOB', payload: response.data})
                    hashHistory.push('/instant_translation')
                    notify.success('Success', 'We’ve sent this instant translation job to the client.')
                })
            } else {
                notify.error('Failed', response.data.message)
            }
        })
    }
}

export function releaseInstantTranslation(id) {
    return function (dispatch) {
        request.post('its/'+id+'/release', {}, (resp) => {
            if (resp.data.code == 200) {
                request.get('its/'+id, {}, (response) => {
                    dispatch({type: 'SHOW_IT_JOB', payload: response.data})
                    request.get('its', {}, (response) => {
                        dispatch({type: 'GET_IT_JOB', payload: response.data})
                        hashHistory.push('/instant_translation')
                        notify.success('Success', 'You have released an instant translation from your responsibility.')
                    })
                })
            } else {
                notify.error('Failed', resp.data.message)
            }
        })
    }
}
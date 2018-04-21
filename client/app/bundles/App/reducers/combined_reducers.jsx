import { combineReducers } from 'redux';
import ItJobs from './instant_translation'
import CmsJobs from './cms'

const AppReducer = combineReducers({ ItJobs, CmsJobs });

export default AppReducer;
import AppReducer from '../reducers/combined_reducers';
import { applyMiddleware, createStore } from "redux"
import logger from "redux-logger"
import thunk from "redux-thunk"
import promise from "redux-promise-middleware"

const middleware = applyMiddleware(promise(), thunk, logger())
const AppStore = (railsProps) => (
  createStore(AppReducer, railsProps, middleware)
);

export default AppStore;
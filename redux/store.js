import {createStore, applyMiddleware} from 'redux';
import reducers from './reducers/index';
import {createLogger} from 'redux-logger';
import promise from 'redux-promise-middleware';

const logger = createLogger();
const enhancers = applyMiddleware(logger, promise);

const store = createStore(reducers, enhancers);

export default store;

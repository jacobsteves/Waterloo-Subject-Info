import React from 'react';
import ReactDOM from 'react-dom';
import { createStore, applyMiddleware, compose } from 'redux';
import thunk from 'redux-thunk';
import createLogger from 'redux-logger';
import { Provider } from 'react-redux';

import rootReducer from './reducers';

import Uni from './components/Uni';

const logger = createLogger();

const store = createStore(rootReducer, {}, compose(
  applyMiddleware(thunk, logger),
  window.devToolsExtension ? window.devToolsExtension() : f => f
));


ReactDOM.render(
  <Provider store={store}>
    <Uni />
  </Provider>, document.getElementById('App')
);

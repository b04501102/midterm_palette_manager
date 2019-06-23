import { applyMiddleware, createStore } from 'redux'
import withRedux from 'next-redux-wrapper'
import createSagaMiddleware from 'redux-saga'
import nextReduxSaga from 'next-redux-saga'

import reducer, { initialState } from './reducer'
import rootSaga from './sega'

const bindMiddleware = middleware => {
  if (process.env.NODE_ENV === 'production') {
    const { composeWithDevTools } = require('redux-devtools-extension')
    return composeWithDevTools(applyMiddleware(...middleware))
  }
  return applyMiddleware(...middleware)
}

const configureStore = () => {
  const sagaMiddleware = createSagaMiddleware()
  const store = createStore(
    reducer,
    initialState,
    bindMiddleware([sagaMiddleware])
  )

  store.sagaTask = sagaMiddleware.run(rootSaga)
  return store
}

export default configureStore
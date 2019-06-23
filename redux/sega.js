import { log } from "util";

import { put, takeLatest, takeEvery, all, call } from 'redux-saga/effects'
import es6promise from 'es6-promise'
import 'isomorphic-unfetch'

// const PALETTES_API_URL =  'http://localhost:3000/api/palettes/'
const PALETTES_API_URL =  'https://palette-manager.herokuapp.com/api/palettes/'

es6promise.polyfill()

function * fetchPalettes() {
  try {
    const json = yield fetch(PALETTES_API_URL)
      .then(res => res.json())
    yield put({ type: 'LOAD_PALETTES_SUCCESS', json})
  } catch(err) {
    console.log('fail to fetch palettes')
  }
}

function * watchFetchPalettes() {
  yield takeEvery('LOAD_PALETTES', fetchPalettes)
}

function * addPalette(action) {
  try {
    const json = yield fetch(PALETTES_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(action.palette)
    }).then(res => {return res.json()})
    
    yield put({ type: 'LOAD_PALETTES', json })
  } catch(err) {
    console.log('fail to add palette')
  }
}
function * watchAddPalette() {
  yield takeEvery('ADD_PALETTE', addPalette)
}

function * updatePalette(action) {
  try {
    const json = yield fetch(PALETTES_API_URL + action.palette._id, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(action.palette)
    }).then(res => {return res.json()})
    
    yield put({ type: 'LOAD_PALETTES', json })
  } catch(err) {
    console.log('fail to add palette')
  }
}
function * watchUpdatePalette() {
  yield takeEvery('UPDATE_PALETTE', updatePalette)
}

function * deletePalette(action) {
  try {
    const json = yield fetch(PALETTES_API_URL + action.id, {
      method: 'DELETE',
    }).then(res => {return res.json()})
    yield put({ type: 'LOAD_PALETTES', json })
  } catch(err) {
    console.log('fail to add palette')
  }
}
function * watchDeletePalette() {
  yield takeEvery('DELETE_PALETTE', deletePalette)
}

export default function * rootSaga() {
  fetchPalettes()
  yield all([
    watchFetchPalettes(),
    watchAddPalette(),
    watchUpdatePalette(),
    watchDeletePalette()
  ])
}
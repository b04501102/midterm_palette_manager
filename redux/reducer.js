import { handleActions } from 'redux-actions'
import { loadPalettesSuccess } from './actions'

export const initialState = {
  palettes: []
}

const reducer = handleActions({
  [loadPalettesSuccess]: (state, action) => {
    return {
      ...state,
      ...{
        palettes: action.json
      }
    }
  }
}, initialState)

export default reducer
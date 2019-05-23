import { handleActions } from 'redux-actions'
import { toggleEditMode, selectPalette, loadPalettesSuccess } from './actions'

import Palette from '../models/paletteModel.js'

export const initialState = {
  isEditMode: false,
  selectedPalette: new Palette(),
  palettes: []
}

const reducer = handleActions({
  [toggleEditMode]: (state, action) => {
    return {
      ...state,
      ...{
        isEditorMode: action.isEditMode
      }
    }
  },
  [selectPalette]: (state, action) => {
    return {
      ...state,
      ...{
        selectedPalette: action.palette
      }
    }
  },
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
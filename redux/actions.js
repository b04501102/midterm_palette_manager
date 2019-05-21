import { createActions } from 'redux-actions'

export const {
  loadPalettes,
  loadPalettesSuccess,
  addPalette,
  deletePalette,
} = createActions({
  LOAD_PALETTES: () => ({}),
  LOAD_PALETTES_SUCCESS: (palettes) => ({ palettes }),
  ADD_PALETTE: () => ({}),
  DELETE_PALETTE: () => ({})
})
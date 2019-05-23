import { createActions } from 'redux-actions'

export const {
  toggleEditMode,
  selectPalette,
  loadPalettes,
  loadPalettesSuccess,
  addPalette,
  updatePalette,
  deletePalette,
} = createActions({
  TOGGLE_EDIT_MODE: (isEditMode) => ({isEditMode}),
  SELECT_PALETTE: (palette) => ({palette}),
  LOAD_PALETTES: () => ({}),
  LOAD_PALETTES_SUCCESS: (palettes) => ({ palettes }),
  ADD_PALETTE: () => ({}),
  UPDATE_PALETTE: () => ({}),
  DELETE_PALETTE: () => ({})
})
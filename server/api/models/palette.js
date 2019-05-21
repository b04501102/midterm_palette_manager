const mongoose = require('mongoose')
const uuid = require('node-uuid')
const schema = mongoose.Schema

const paletteModel = new schema({
  _id: { type: String, default: uuid.v1 },
  title: { type: String, default: 'Default Title' },
  author: { type: Array, default: [] },
  image: { type: String },
  colors: { type: Array, default: [] },
  tags: { type: Array, default: [] },
  create_at: { type: Date, default: Date.now },
  last_modified_at: { type: Date, default: Date.now },
  comments: { type: Array, default: [] }
})

module.exports = mongoose.models.Palette || mongoose.model('Palette', paletteModel)
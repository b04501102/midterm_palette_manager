const express = require('express')
const router = express.Router()

const Palette = require('./models/palette')

router.get('/', (req, res) => {
  Palette.find({}, (err, palettes) => {
    res.json(palettes)
  })
})
router.post('/', (req, res) => {
  const palette = new Palette(req.body)

  palette.save(err => {
    if(err) throw err
  })
})
router.put('/:id', (req, res) => {
  console.log(req.body)
  
  Palette.findByIdAndUpdate(req.params.id, req.body, (err, doc) => { console.log(err) })
})
router.delete('/:id', (req, res) => {
  Palette.findByIdAndRemove(req.params.id, (err, doc) => { console.log(err) })
})

module.exports = router
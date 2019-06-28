const mongoose = require('mongoose')
const uuid = require('node-uuid')

const mongoDB = process.env.NODE_DEV !== 'production' ? 'mongodb://rainforest:abcd1234@rainforest.tools:32768/admin' : 'mongodb://rainforest:abcd1234@192.168.0.143:32768/admin'

mongoose.Promise = Promise

mongoose.connect(mongoDB, { 
    useNewUrlParser: true 
})

mongoose.connection.on('error', error => {
    console.log(error)
})

const Schema = mongoose.Schema

const paletteModel = new Schema({
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

const PalleteModel = mongoose.models.Palette || mongoose.model('Palette', paletteModel)

module.exports = {
	getPalletes: () => PalleteModel.find().sort({ create_at: 1 })
	,
	// getPalletes_inorder: () => {PalleteModel.findOne({ _id })}
	// ,
	createPallete: args => {
		PalleteModel.create(args)
    },
    deletePallete: _id =>{
        return PalleteModel.deleteOne({"_id": _id})
    },
    updatePallete: args => {
        return PalleteModel.updateOne(
            {_id: args._id},
            {
                title: args.title,
                author: args.author,
                image: args.image,
                colors: args.colors,
                tags: args.tags,
                create_at: args.create_at,
                last_modified_at: args.last_modified_at,
                comments: args.comments
            }
        )
    }
}
const { Schema, model } = require('mongoose')

const PetSchema = Schema({
	age: {
		type: String,
		required: true
	},
	city: {
		type: String,
		required: true
	},
	description: {
		type: [String],
		required: true
	},
	name: {
		type: String,
		required: true
	},
	photoUrl: {
		type: [String],
		required: true
	},
	postedBy: {
		type: Schema.Types.ObjectId,
		ref: 'Usuario',
		required: true
	}
})

module.exports = model('Pet', PetSchema)

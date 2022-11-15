const { Schema, model } = require('mongoose')

const PetSchema = Schema({
	age: {
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
	photos: {
		type: [String],
		required: true
	},
	postedBy: {
		type: Schema.Types.ObjectId,
		ref: 'Usuario',
		required: true
	}
})

PetSchema.method('toJSON', function () {
	const { __v, _id, ...object } = this.toObject()
	object.id = _id
	return object
})

module.exports = model('Pet', PetSchema)

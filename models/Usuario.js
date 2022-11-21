const { Schema, model } = require('mongoose')

const UsuarioSchema = Schema({
	city: {
		type: String,
		required: true
	},
	email: {
		type: String,
		required: true,
		unique: true
	},
	name: {
		type: String,
		required: true
	},
	online: {
		type: Boolean,
		default: false
	},
	password: {
		type: String,
		required: true
	},
	photoUrl: {
		type: String,
		default: ''
	},
	liked: [
		{
			type: Schema.Types.ObjectId,
			ref: 'Pet'
		}
	],
	disliked: [
		{
			type: Schema.Types.ObjectId,
			ref: 'Pet'
		}
	],
	chats: [
		{
			type: Schema.Types.ObjectId,
			ref: 'Usuario'
		}
	]
})

UsuarioSchema.method('toJSON', function () {
	const { __v, _id, ...object } = this.toObject()
	object.id = _id
	return object
})

module.exports = model('Usuario', UsuarioSchema)

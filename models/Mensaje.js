const { Schema, model } = require('mongoose')

const MensajeSchema = Schema(
	{
		de: {
			type: Schema.Types.ObjectId,
			ref: 'Usuario',
			required: true
		},
		para: {
			type: Schema.Types.ObjectId,
			ref: 'Usuario',
			required: true
		},
		mensaje: {
			type: String,
			required: true
		}
	},
	{
		timestamps: true
	}
)

module.exports = model('Mensaje', MensajeSchema)

const Pet = require('../models/Pet')
const Usuario = require('../models/Usuario')

const getPets = async (req, res) => {
	const id = req.uid
	const usuario = await Usuario.findById(id)

	const pets = await Pet.find({
		$and: [
			{ postedBy: { $ne: id } },
			{ _id: { $nin: usuario.liked } },
			{ _id: { $nin: usuario.disliked } }
		]
	})

	res.status(200).json({
		ok: true,
		pets
	})
}

const getOwnPets = async (req, res) => {
	const pets = await Pet.find({ postedBy: req.uid })

	res.status(200).json({
		ok: true,
		pets
	})
}

const crearPet = async (req, res) => {
	const pet = new Pet(req.body)
	try {
		pet.postedBy = req.uid

		await pet.save()

		res.json({
			ok: true,
			pet
		})
	} catch (error) {
		console.log(error)
		res.status(500).json({
			ok: false,
			msg: 'Hable con el administrador'
		})
	}
}

module.exports = {
	crearPet,
	getOwnPets,
	getPets
}

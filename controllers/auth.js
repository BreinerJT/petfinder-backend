const Usuario = require('../models/Usuario')
const Pet = require('../models/Pet')
const bcrypt = require('bcrypt')
const { generarJWT } = require('../helpers/jwt')

const crearUsuario = async (req, res) => {
	const { email, password } = req.body
	try {
		let usuario = await Usuario.findOne({ email })

		if (usuario) {
			return res.status(400).json({
				ok: false,
				msg: 'Ya existe una cuenta con el correo.'
			})
		}

		usuario = new Usuario(req.body)

		// Encriptar Contraseña
		const salt = bcrypt.genSaltSync()
		usuario.password = bcrypt.hashSync(password, salt)

		// Guardar en DB
		await usuario.save()

		// Generar JWT
		const { city, name, photoUrl, id } = usuario
		const token = await generarJWT(id, city, email, name, photoUrl)

		res.status(201).json({
			ok: true,
			city,
			email,
			name,
			photoUrl,
			uid: id,
			token
		})
	} catch (error) {
		console.log(error)
		res.status(500).json({
			ok: false,
			msg: 'Por favor hable con el administrador'
		})
	}
}

const loginUsuario = async (req, res) => {
	const { email, password } = req.body
	try {
		const usuario = await Usuario.findOne({ email }).populate('liked')

		if (!usuario) {
			return res.status(400).json({
				ok: false,
				msg: 'No existe una cuenta con el correo.'
			})
		}

		const isValidPassword = bcrypt.compareSync(password, usuario.password)

		if (!isValidPassword) {
			return res.status(400).json({
				ok: false,
				msg: 'Contraseña incorrecta.'
			})
		}

		// Generar JWT
		const { city, name, photoUrl, id, liked } = usuario
		const token = await generarJWT(id, city, email, name, photoUrl)

		res.status(202).json({
			ok: true,
			city,
			email,
			liked,
			name,
			photoUrl,
			uid: id,
			token
		})
	} catch (error) {
		console.log(error)
		res.status(500).json({
			ok: false,
			msg: 'Por favor hable con el administrador'
		})
	}
}

const getLikedPets = async (req, res) => {
	const { uid } = req
	try {
		const usuario = await Usuario.findById(uid).populate('liked')

		res.json({
			ok: true,
			liked: usuario.liked
		})
	} catch (error) {
		console.log(error)
		res.status(500).json({
			ok: false,
			msg: 'Por favor hable con el administrador'
		})
	}
}

const updateLikes = async (req, res) => {
	const { uid } = req.body
	const petId = req.params.id
	try {
		const usuario = await Usuario.findById(uid)
		const newLikes = [petId, ...usuario.liked]

		const usuarioActualizado = await Usuario.findByIdAndUpdate(
			uid,
			{ liked: newLikes },
			{
				new: true
			}
		).populate('liked')

		res.status(200).json({
			ok: true,
			usuario: usuarioActualizado
		})
	} catch (error) {
		console.log(error)
		res.status(500).json({
			ok: false,
			msg: 'Hable con el administrador'
		})
	}
}

const updatePhotoUrl = async (req, res) => {
	const uid = req.params.id
	const { url } = req.body
	try {
		const usuario = await Usuario.findByIdAndUpdate(
			uid,
			{ photoUrl: url },
			{ new: true }
		).populate('liked')

		const { city, name, photoUrl, id, liked, email } = usuario
		const token = await generarJWT(id, city, email, name, photoUrl)

		res.json({
			ok: true,
			city,
			email,
			liked,
			name,
			photoUrl,
			uid: id,
			token
		})
	} catch (error) {
		console.log(error)
		res.status(500).json({
			ok: false,
			msg: 'Hable con el administrador'
		})
	}
}

const revalidarToken = async (req, res) => {
	const { uid, city, email, name, photoUrl } = req
	// Generar JWT
	const token = await generarJWT(uid, city, email, name, photoUrl)

	res.json({
		ok: true,
		uid,
		city,
		email,
		name,
		photoUrl,
		token
	})
}

module.exports = {
	crearUsuario,
	getLikedPets,
	loginUsuario,
	revalidarToken,
	updateLikes,
	updatePhotoUrl
}

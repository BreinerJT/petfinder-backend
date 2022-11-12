const Usuario = require('../models/Usuario')
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
		const token = await generarJWT(id, city, email, name)

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
		const usuario = await Usuario.findOne({ email })

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
		const { city, name, photoUrl, id } = usuario
		const token = await generarJWT(id, city, email, name)

		res.status(202).json({
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

const revalidarToken = async (req, res) => {
	const { uid, city, email, name } = req

	// Generar JWT
	const token = await generarJWT(uid, city, email, name)

	res.json({
		ok: true,
		uid,
		city,
		email,
		name,
		token
	})
}

module.exports = {
	crearUsuario,
	loginUsuario,
	revalidarToken
}

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
		const token = await generarJWT(usuario.id, usuario.name)

		res.status(201).json({
			ok: true,
			uid: usuario.uid,
			name: usuario.name,
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
		const token = await generarJWT(usuario.id, usuario.name)

		res.status(202).json({
			ok: true,
			uid: usuario.uid,
			name: usuario.name,
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

const revalidarToken = (req, res) => {
	const { uid, name } = req.body

	// Generar JWT

	res.json({
		ok: true,
		uid,
		name
		// token
	})
}

module.exports = {
	crearUsuario,
	loginUsuario,
	revalidarToken
}

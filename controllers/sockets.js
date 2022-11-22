const Usuario = require('../models/Usuario')
const Mensaje = require('../models/Mensaje')

const usuarioConectado = async uid => {
	const usuario = await Usuario.findById(uid)
	usuario.online = true
	await usuario.save()

	return usuario
}

const usuarioDesconectado = async uid => {
	const usuario = await Usuario.findById(uid)
	usuario.online = false
	await usuario.save()

	return usuario
}

const grabarMensaje = async payload => {
	try {
		const mensaje = new Mensaje(payload)
		await mensaje.save()

		return mensaje
	} catch (error) {
		console.log(error)
		return false
	}
}

const createChat = async (uid, payload) => {
	try {
		const usuario = await Usuario.findById(uid)
		if (usuario.chats.includes(payload)) return
		const newChats = [payload, ...usuario.chats]
		usuario.chats = newChats
		await usuario.save()
		return usuario
	} catch (error) {
		console.log(error)
		return false
	}
}

const getChats = async uid => {
	const usuarios = await Usuario.findById(uid).populate('chats')
	return usuarios.chats
}

module.exports = {
	createChat,
	getChats,
	grabarMensaje,
	usuarioConectado,
	usuarioDesconectado
}

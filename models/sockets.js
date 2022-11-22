const {
	createChat,
	getChats,
	grabarMensaje,
	usuarioConectado,
	usuarioDesconectado
} = require('../controllers/sockets')
const { verificarJWT } = require('../helpers/jwt')

class Sockets {
	constructor(io) {
		this.io = io

		this.socketEvents()
	}

	socketEvents() {
		this.io.on('connection', async socket => {
			const [valido, uid] = verificarJWT(socket.handshake.query['x-token'])

			if (!valido) {
				console.log('socket no identificado')
				return socket.disconnect()
			}

			await usuarioConectado(uid)

			socket.join(uid)

			this.io.to(uid).emit('lista-chats', await getChats(uid))

			socket.on('crear-chat', async payload => {
				await createChat(uid, payload)
				this.io.to(uid).emit('lista-chats', await getChats(uid))
			})

			socket.on('mensaje-personal', async payload => {
				const mensaje = await grabarMensaje(payload)
				this.io.to(payload.para).emit('mensaje-personal', mensaje)
				this.io.to(payload.de).emit('mensaje-personal', mensaje)
				this.io
					.to(payload.para)
					.emit('crear-chat', await createChat(payload.para, uid))
				this.io
					.to(payload.para)
					.emit('lista-chats', await getChats(payload.para))
			})

			socket.on('disconnect', async () => {
				await usuarioDesconectado(uid)
				this.io.to(uid).emit('lista-chats', await getChats(uid))
			})
		})
	}
}

module.exports = Sockets

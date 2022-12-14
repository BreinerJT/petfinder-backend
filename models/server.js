// Servidor de Express
const express = require('express')
const socketio = require('socket.io')
const cors = require('cors')
const http = require('http')
const Sockets = require('./sockets')
const { dbConnection } = require('../database/config')

class Server {
	constructor() {
		this.app = express()
		this.port = process.env.PORT

		dbConnection()

		this.server = http.createServer(this.app)
		this.io = socketio(this.server, {
			cors: {
				origin: ['*'],
				methods: ['GET', 'POST', 'PUT', 'DELETE']
			}
		})
	}

	middlewares() {
		this.app.use(cors())
		this.app.use(express.json())

		// API Endpoints
		this.app.use('/api/auth', require('../routes/auth'))
		this.app.use('/api/pet', require('../routes/pet'))
		this.app.use('/api/messages', require('../routes/messages'))
	}

	configurarSockets() {
		new Sockets(this.io)
	}

	execute() {
		this.middlewares()

		this.configurarSockets()

		this.server.listen(this.port, () => {
			console.log('Server running in port:', this.port)
		})
	}
}

module.exports = Server

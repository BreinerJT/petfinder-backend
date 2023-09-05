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
		this.app.use((req, res, next) => {
			// res.header("Access-Control-Allow-Origin", "*");
			const allowedOrigins = [
				'http://localhost:3000',
				'http://petfinder.onrender.com',
				'https://petfinder.onrender.com'
			]
			const origin = req.headers.origin
			if (allowedOrigins.includes(origin)) {
				res.setHeader('Access-Control-Allow-Origin', origin)
			}
			res.header(
				'Access-Control-Allow-Headers',
				'Origin, X-Requested-With, Content-Type, Accept, Authorization'
			)
			res.header('Access-Control-Allow-credentials', true)
			res.header(
				'Access-Control-Allow-Methods',
				'GET, POST, PUT, DELETE, UPDATE'
			)
			next()
		})

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

class Sockets {
	constructor(io) {
		this.io = io

		this.socketsEvent()
	}

	socketEvent() {}
}

module.exports = Sockets

const mongoose = require('mongoose')

const dbConnection = async () => {
	const DB_CNN = process.env.DB_CNN

	try {
		await mongoose.connect(DB_CNN)
		console.log('DB Online.')
	} catch (error) {
		console.log(error)
		throw new Error('Error en conexion a la DB.')
	}
}

module.exports = { dbConnection }

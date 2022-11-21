const jwt = require('jsonwebtoken')

const generarJWT = (uid, city, email, name, photoUrl) => {
	return new Promise((resolve, reject) => {
		const payload = { uid, city, email, name, photoUrl }

		jwt.sign(
			payload,
			process.env.JWT_PRIVATE_KEY,
			{
				expiresIn: '365d'
			},
			(err, token) => {
				if (err) {
					console.log(err)
					reject('No se pudo generar el token')
				}

				resolve(token)
			}
		)
	})
}

const verificarJWT = (token = '') => {
	try {
		const { uid } = jwt.verify(token, process.env.JWT_PRIVATE_KEY)

		return [true, uid]
	} catch (error) {
		return [false, null]
	}
}

module.exports = { generarJWT, verificarJWT }

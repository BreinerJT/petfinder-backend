const jwt = require('jsonwebtoken')

const generarJWT = (id, city, email, name) => {
	return new Promise((resolve, reject) => {
		const payload = { id, city, email, name }

		jwt.sign(
			payload,
			process.env.JWT_PRIVATE_KEY,
			{
				expiresIn: '24h'
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

module.exports = { generarJWT }

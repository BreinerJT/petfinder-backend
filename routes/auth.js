/*
  Route: /api/auth
*/
const { Router } = require('express')
const { check } = require('express-validator')
const { validarCampos } = require('../middlewares/validar-campos')
const { validarJWT } = require('../middlewares/validar-jwt')
const {
	crearUsuario,
	loginUsuario,
	revalidarToken,
	updateLikes,
	getLikedPets,
	updatePhotoUrl
} = require('../controllers/auth')

const router = Router()

router.post(
	'/new',
	[
		check('city', 'La ciudad es obligatoria.').not().isEmpty(),
		check('email', 'El email no es valido.').isEmail(),
		check('name', 'El nombre es obligatorio.').not().isEmpty(),
		check('password', 'La contraseña es obligatoria.').not().isEmpty(),
		validarCampos
	],
	crearUsuario
)

router.post(
	'/',
	[
		check('email', 'El email no es valido.').isEmail(),
		check('password', 'La contraseña es obligatoria.').not().isEmpty(),
		validarCampos
	],
	loginUsuario
)

router.put('/:id', validarJWT, updateLikes)
router.put('/photo/:id', validarJWT, updatePhotoUrl)

router.get('/liked', validarJWT, getLikedPets)
router.get('/renew', validarJWT, revalidarToken)

module.exports = router

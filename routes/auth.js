/*
  Route: /api/auth
*/
const { Router } = require('express')
const { check } = require('express-validator')
const { validarCampos } = require('../middlewares/validar-campos')
const { validarJWT } = require('../middlewares/validar-jwt')
const {
	crearUsuario,
	getLikedPets,
	loginUsuario,
	revalidarToken,
	updateDislikes,
	updateLikes,
	updatePhotoUrl
} = require('../controllers/auth')

const router = Router()

router.get('/liked', validarJWT, getLikedPets)
router.get('/renew', validarJWT, revalidarToken)

router.put('/like/:id', validarJWT, updateLikes)
router.put('/dislike/:id', validarJWT, updateDislikes)
router.put('/photo/:id', validarJWT, updatePhotoUrl)

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

module.exports = router

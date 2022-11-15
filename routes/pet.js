/*
  Route: /api/pet
*/
const { Router } = require('express')
const { check } = require('express-validator')
const { crearPet, getPets, getOwnPets } = require('../controllers/pets')
const { validarJWT } = require('../middlewares/validar-jwt')
const { validarCampos } = require('../middlewares/validar-campos')

const router = Router()

router.use(validarJWT)

router.get('/', getPets)
router.get('/mine', getOwnPets)

router.post(
	'/new',
	[
		check('age', 'Es necesaria ingresar una edad').not().isEmpty(),
		check('description', 'Es necesario ingresar tres cualidades.').isArray({
			min: 3,
			max: 3
		}),
		check('name', 'Es necesario ingresar un nombre').not().isEmpty(),
		check('photos', 'Es necesario agregar entre 1 y 4 fotos.').isArray({
			min: 1,
			max: 4
		}),
		validarCampos
	],
	crearPet
)

module.exports = router

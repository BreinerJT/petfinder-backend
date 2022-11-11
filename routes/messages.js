/*
  Route: /api/mensajes
*/
const { Router } = require('express')
const { getChat } = require('../controllers/messages')
const { validarJWT } = require('../middlewares/validar-jwt')

const router = Router()

router.use(validarJWT)

router.get('/:de', getChat)

module.exports = router

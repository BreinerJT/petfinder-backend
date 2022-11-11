const express = require('express')
const cors = require('cors')
const { dbConnection } = require('./database/config')
require('dotenv').config()

dbConnection()

const app = express()
app.use(cors())
app.use(express.json())

app.use('/api/auth', require('./routes/auth'))
app.use('/api/pet', require('./routes/pet'))

const PORT = process.env.PORT
app.listen(PORT, () => {
	console.log(`Server running in server ${PORT}`)
})

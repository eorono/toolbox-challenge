const express = require('express')
const cors = require('cors')
const dataRoutes = require('./routes/dataRoutes') // <--- Importamos rutas

const app = express()
const PORT = 3000

app.use(express.json())
app.use(cors())

// Montamos las rutas bajo el prefijo /files
// El requisito pide el endpoint GET /files/data
app.use('/files', dataRoutes) // <--- Usamos rutas

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`)
})

module.exports = app
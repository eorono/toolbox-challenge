const express = require('express')
const cors = require('cors')
const app = express()
const PORT = 3000

// Middlewares
app.use(express.json())
app.use(cors()) // Útil para cuando conectemos el Frontend React

// Ruta de prueba básica (Health Check)
app.get('/', (req, res) => {
    res.json({ message: 'API is running' })
})

// Inicio del servidor
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`)
})

module.exports = app // Exportamos para poder hacer tests después
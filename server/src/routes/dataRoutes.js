const express = require('express')
const router = express.Router()
const DataController = require('../controllers/DataController')

router.get('/data', DataController.getData)

module.exports = router
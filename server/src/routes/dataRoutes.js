const express = require('express')
const router = express.Router()
const DataController = require('../controllers/DataController')

router.get('/data', DataController.getData)
router.get('/list', DataController.getList)

module.exports = router

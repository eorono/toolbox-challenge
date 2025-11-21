const DataService = require('../services/DataService')

const getData = async (req, res) => {
    try {
        // Capturamos el query param opcional ?fileName=...
        const { fileName } = req.query

        // Se lo pasamos al servicio
        const data = await DataService.getFilesData(fileName)

        res.status(200).json(data)
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}

const getList = async (req, res) => {
    try {
        const list = await DataService.getFilesList()
        res.status(200).json(list)
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}

module.exports = { getData, getList }
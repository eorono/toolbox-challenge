const DataService = require('../services/DataService')

const getData = async (req, res) => {
    try {
        const data = await DataService.getFilesData()
        res.status(200).json(data)
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}

module.exports = { getData }
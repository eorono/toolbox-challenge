const axios = require('axios')

// Configuración del API Externo según el documento
const API_URL = 'https://echo-serv.tbxnet.com'
const API_KEY = 'Bearer aSuperSecretKey'

// Creamos una instancia de Axios para reutilizar la configuración base
const client = axios.create({
    baseURL: API_URL,
    headers: {
        Authorization: API_KEY
    }
})

/**
 * Punto Opcional: Devuelve la lista cruda de archivos
 */
const getFilesList = async () => {
    try {
        const { data } = await client.get('/v1/secret/files')
        return data.files // Retornamos solo el array de nombres
    } catch (error) {
        throw new Error('Failed to fetch file list')
    }
}

/**
 * Parsea una línea CSV cruda y devuelve un objeto formateado o null si no es válida.
 * Reglas aplicadas:
 * 1. Debe tener 4 columnas (file, text, number, hex).
 * 2. Ignoramos el header si aparece.
 */
const parseLine = (rawLine) => {
    const parts = rawLine.split(',')

    if (parts.length !== 4) return null

    const [fileName, text, number, hex] = parts

    if (!fileName || !text || !number || !hex) return null

    // Validamos que el número sea realmente un número
    const convertedNumber = Number(number)

    // Si es NaN (Not a Number), descartamos la línea completa
    if (isNaN(convertedNumber)) return null

    return {
        text: text.trim(),
        number: convertedNumber,
        hex: hex.trim()
    }
}

/**
 * Función principal para obtener y formatear los datos.
 */
const getFilesData = async (fileName) => {
    try {
        let filesToDownload = []

        // Lógica de Filtrado:
        // Si nos pasan un fileName, solo descargamos ese.
        // Si no, llamamos al API externo para obtener la lista completa.
        if (fileName) {
            filesToDownload = [fileName]
        } else {
            const { data } = await client.get('/v1/secret/files')
            filesToDownload = data.files
        }

        const downloads = await Promise.all(
            filesToDownload.map(async (file) => {
                try {
                    const response = await client.get(`/v1/secret/file/${file}`)
                    return { fileName: file, content: response.data, status: 'success' }
                } catch (error) {
                    console.error(`Error downloading ${file}: ${error.message}`)
                    return { fileName: file, status: 'error' }
                }
            })
        )

        const formattedData = downloads
            .filter(item => item.status === 'success')
            .map(fileData => {
                const lines = fileData.content.split('\n')
                const validLines = lines
                    .map(parseLine)
                    .filter(line => line !== null)

                if (validLines.length === 0) return null

                return {
                    file: fileData.fileName,
                    lines: validLines
                }
            })
            .filter(file => file !== null)

        return formattedData

    } catch (error) {
        throw new Error('Failed to fetch files data')
    }
}

module.exports = { getFilesData, getFilesList }
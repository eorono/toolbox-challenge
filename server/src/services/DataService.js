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
 * Parsea una línea CSV cruda y devuelve un objeto formateado o null si no es válida.
 * Reglas aplicadas:
 * 1. Debe tener 4 columnas (file, text, number, hex).
 * 2. Ignoramos el header si aparece.
 */
const parseLine = (rawLine) => {
    const parts = rawLine.split(',')

    // Validación básica: El formato estricto pide 4 columnas [cite: 72-76]
    if (parts.length !== 4) return null

    const [fileName, text, number, hex] = parts

    // Verificación extra: Aseguramos que los campos no estén vacíos
    // y evitamos procesar la línea del header ("file,text,number,hex")
    if (!fileName || !text || !number || !hex) return null
    if (number === 'number') return null // Detecta si es la cabecera

    return {
        text: text.trim(),
        number: Number(number), // Convertimos a número como pide el tipo de dato
        hex: hex.trim()
    }
}

/**
 * Función principal para obtener y formatear los datos.
 */
const getFilesData = async () => {
    try {
        // 1. Obtener el listado de archivos disponibles 
        const { data } = await client.get('/v1/secret/files')
        const { files } = data

        // 2. Descargar cada archivo en paralelo.
        // Usamos Promise.allSettled (o un try/catch map) para que si un archivo falla,
        // no rompa toda la ejecución, ya que el requisito dice "pueden existir errores al descargar"[cite: 90].
        const downloads = await Promise.all(
            files.map(async (fileName) => {
                try {
                    const response = await client.get(`/v1/secret/file/${fileName}`)
                    return { fileName, content: response.data, status: 'success' }
                } catch (error) {
                    // Si falla la descarga, retornamos null para filtrarlo después
                    console.error(`Error downloading ${fileName}: ${error.message}`)
                    return { fileName, status: 'error' }
                }
            })
        )

        // 3. Procesar y Formatear la información [cite: 87-91]
        const formattedData = downloads
            .filter(item => item.status === 'success') // Nos quedamos solo con las descargas exitosas
            .map(fileData => {
                const lines = fileData.content.split('\n')

                // Procesamos línea por línea
                const validLines = lines
                    .map(parseLine)
                    .filter(line => line !== null) // Descartamos líneas con error 

                // Si el archivo no tiene líneas válidas, ¿lo devolvemos?
                // El ejemplo muestra archivos con contenido. Si está vacío, mejor no ensuciar la respuesta.
                if (validLines.length === 0) return null

                return {
                    file: fileData.fileName,
                    lines: validLines
                }
            })
            .filter(file => file !== null) // Filtramos los archivos que quedaron vacíos o inválidos

        return formattedData

    } catch (error) {
        // Manejo de error general del servicio
        throw new Error('Failed to fetch files data')
    }
}

module.exports = { getFilesData }
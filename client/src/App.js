import { useState, useEffect } from 'react'
import Container from 'react-bootstrap/Container'
import Table from 'react-bootstrap/Table'
import Spinner from 'react-bootstrap/Spinner'
import Alert from 'react-bootstrap/Alert'
import axios from 'axios'

function App() {
  const [files, setFiles] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  // Hook Effect para cargar los datos al montar el componente 
  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      setLoading(true)
      // Gracias al proxy en package.json, no necesitamos poner http://localhost:3000
      const response = await axios.get('http://localhost:3000/files/data')
      setFiles(response.data)
    } catch (err) {
      setError('Error fetching data. Make sure the API is running on port 3000.')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Container className="mt-5">
      <h1 className="mb-4 text-white bg-dark p-3 rounded">React Test App</h1>

      {error && <Alert variant="danger">{error}</Alert>}

      {loading ? (
        <div className="text-center mt-5">
          <Spinner animation="border" role="status">
            <span className="visually-hidden">Loading...</span>
          </Spinner>
        </div>
      ) : (
        <Table striped bordered hover responsive>
          <thead className="table-dark">
            <tr>
              <th>File Name</th>
              <th>Text</th>
              <th>Number</th>
              <th>Hex</th>
            </tr>
          </thead>
          <tbody>
            {files.length > 0 ? (
              files.map((file, fileIndex) => (
                // Mapeamos cada archivo. Como el wireframe muestra una fila por cada línea de datos,
                // debemos iterar sobre las 'lines' de cada archivo.
                file.lines.map((line, lineIndex) => (
                  <tr key={`${file.file}-${fileIndex}-${lineIndex}`}>
                    <td>{file.file}</td>
                    <td>{line.text}</td>
                    <td>{line.number}</td>
                    <td>{line.hex}</td>
                  </tr>
                ))
              ))
            ) : (
              <tr>
                <td colSpan="4" className="text-center">No data found</td>
              </tr>
            )}
          </tbody>
        </Table>
      )}
    </Container>
  )
}

export default App
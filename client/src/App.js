import { useState, useEffect } from 'react'
import Container from 'react-bootstrap/Container'
import Table from 'react-bootstrap/Table'
import Spinner from 'react-bootstrap/Spinner'
import Alert from 'react-bootstrap/Alert'
import Form from 'react-bootstrap/Form'
import Button from 'react-bootstrap/Button'
import InputGroup from 'react-bootstrap/InputGroup'
import axios from 'axios'

function App() {
  const [files, setFiles] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [searchText, setSearchText] = useState('')

  // Hook Effect para cargar los datos al montar el componente 
  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async (fileName = null) => {
    try {
      setLoading(true)
      setError(null)

      const options = {
        params: {}
      }

      // Solo agregamos el parámetro si existe texto
      if (fileName) {
        options.params.fileName = fileName
      }

      const response = await axios.get('http://localhost:3000/files/data', options)

      setFiles(response.data)
    } catch (err) {
      setError('Error fetching data. Make sure the API is running on port 3000.')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  // Manejador del submit del formulario
  const handleSearch = (e) => {
    e.preventDefault()
    fetchData(searchText)
  }

  return (
    <Container className="mt-5">
      <div className="d-flex justify-content-between align-items-center mb-4 bg-dark p-3 rounded text-white">
        <h1 className="m-0 h3">React Test App</h1>
      </div>

      {/* --- Barra de Búsqueda --- */}
      <Form onSubmit={handleSearch} className="mb-4">
        <InputGroup>
          <Form.Control
            placeholder="Search by file name (e.g., test2.csv)"
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
          />
          <Button variant="primary" type="submit" disabled={loading}>
            Search
          </Button>
        </InputGroup>
      </Form>
      {/* ------------------------- */}

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
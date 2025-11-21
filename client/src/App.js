import { useEffect } from 'react'
import Container from 'react-bootstrap/Container'
import Table from 'react-bootstrap/Table'
import Spinner from 'react-bootstrap/Spinner'
import Alert from 'react-bootstrap/Alert'
import Form from 'react-bootstrap/Form'
import Button from 'react-bootstrap/Button'
import InputGroup from 'react-bootstrap/InputGroup'
import { useSelector, useDispatch } from 'react-redux'
import { fetchFilesData, fetchFileList, setSelectedFile } from './store/dataSlice'

function App() {

  const dispatch = useDispatch()

  // Extraemos el estado desde Redux
  const {
    files,
    fileList,
    loading,
    error,
    selectedFile
  } = useSelector((state) => state.data)

  useEffect(() => {
    // Disparamos las acciones al iniciar
    dispatch(fetchFilesData())
    dispatch(fetchFileList())
  }, [dispatch])

  const handleSearch = (e) => {
    e.preventDefault()
    // Disparamos la acción asíncrona con el filtro actual
    dispatch(fetchFilesData(selectedFile))
  }

  const handleReset = () => {
    // Limpiamos el input en el estado global
    dispatch(setSelectedFile(''))
    // Recargamos la tabla sin filtros
    dispatch(fetchFilesData())
  }

  return (
    <Container className="mt-5">
      <div className="d-flex justify-content-between align-items-center mb-4 bg-dark p-3 rounded text-white">
        <h1 className="m-0 h3">React Test App</h1>
      </div>

      <Form onSubmit={handleSearch} className="mb-4">
        <InputGroup>
          {/* Input de Texto con Autocompletado */}
          <Form.Control
            placeholder="Search by file name..."
            value={selectedFile}
            onChange={(e) => dispatch(setSelectedFile(e.target.value))}
            list="files-options"
          />

          {/* Botón de búsqueda manual */}
          <Button variant="primary" type="submit" disabled={loading}>
            Search
          </Button>

          <Button variant="outline-secondary" onClick={handleReset} disabled={loading}>
            Reset
          </Button>
        </InputGroup>

        <Form.Text className="text-muted">
          Empieza a escribir para ver sugerencias del servidor.
        </Form.Text>

        {/* Esta es la lista invisible que el navegador usa para sugerir */}
        <datalist id="files-options">
          {fileList.map((fileName, index) => (
            <option key={index} value={fileName} />
          ))}
        </datalist>
      </Form>

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
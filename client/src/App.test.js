import { render, screen } from '@testing-library/react';
import App from './App';
import axios from 'axios';

// Mockeamos axios
jest.mock('axios');

test('renders React Test App title and table headers', async () => {
  // Configuramos el mock para que devuelva un array vacío y no rompa el map
  axios.get.mockResolvedValue({ data: [] });

  render(<App />);

  // 1. El título siempre está presente (no depende del loading)
  const titleElement = screen.getByText(/React Test App/i);
  expect(titleElement).toBeInTheDocument();

  // 2. SOLUCIÓN: Usamos 'findByText' (es asíncrono).
  // Esto espera (hasta 1 seg) a que el Spinner desaparezca y aparezca "File Name".
  // Al esperar esto, también solucionamos el warning de "act(...)"
  const fileNameHeader = await screen.findByText(/File Name/i);
  expect(fileNameHeader).toBeInTheDocument();

  // 3. Ahora que sabemos que la tabla cargó, podemos buscar el resto
  expect(screen.getByText(/Text/i)).toBeInTheDocument();
  expect(screen.getByText(/Number/i)).toBeInTheDocument();
  expect(screen.getByText(/Hex/i)).toBeInTheDocument();
});
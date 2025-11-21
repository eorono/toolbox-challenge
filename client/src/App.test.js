import { render, screen } from '@testing-library/react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import App from './App';
import dataReducer from './store/dataSlice';
import axios from 'axios';

// Mockeamos axios
jest.mock('axios');

// Función helper para renderizar con Redux
const renderWithRedux = (
  component,
  { initialState, store = configureStore({ reducer: { data: dataReducer } }) } = {}
) => {
  return {
    ...render(<Provider store={store}>{component}</Provider>),
    store,
  }
}

test('renders React Test App title and table headers', async () => {
  // Configuramos el mock para ambas llamadas (lista y data)
  axios.get.mockResolvedValue({ data: [] });

  // Renderizamos usando el helper que envuelve en Provider
  renderWithRedux(<App />);

  const titleElement = screen.getByText(/React Test App/i);
  expect(titleElement).toBeInTheDocument();

  const fileNameHeader = await screen.findByText(/File Name/i);
  expect(fileNameHeader).toBeInTheDocument();

  expect(screen.getByText(/Text/i)).toBeInTheDocument();
  expect(screen.getByText(/Number/i)).toBeInTheDocument();
  expect(screen.getByText(/Hex/i)).toBeInTheDocument();
});
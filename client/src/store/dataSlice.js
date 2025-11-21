import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import axios from 'axios'

// --- THUNKS (Acciones Asíncronas) ---

// 1. Acción para traer la tabla de datos (con o sin filtro)
export const fetchFilesData = createAsyncThunk(
    'data/fetchFilesData',
    async (fileName = null, { rejectWithValue }) => {
        try {
            const options = { params: {} }
            if (fileName) options.params.fileName = fileName

            const response = await axios.get('http://localhost:3000/files/data', options)
            return response.data
        } catch (error) {
            return rejectWithValue('Error fetching data. Is the Backend running?')
        }
    }
)

// 2. Acción para traer la lista de nombres (Dropdown)
export const fetchFileList = createAsyncThunk(
    'data/fetchFileList',
    async (_, { rejectWithValue }) => {
        try {
            const response = await axios.get('http://localhost:3000/files/list')
            return response.data
        } catch (error) {
            return rejectWithValue('Error fetching file list')
        }
    }
)

// --- SLICE (Estado y Reducers) ---

const dataSlice = createSlice({
    name: 'data',
    initialState: {
        files: [],      // Datos de la tabla
        fileList: [],   // Datos del dropdown
        loading: false, // Spinner
        error: null,    // Mensajes de error
        selectedFile: '' // Lo que el usuario escribió/seleccionó
    },
    reducers: {
        // Acción síncrona para actualizar el input de texto
        setSelectedFile: (state, action) => {
            state.selectedFile = action.payload
        }
    },
    extraReducers: (builder) => {
        builder
            // --- Manejo de fetchFilesData ---
            .addCase(fetchFilesData.pending, (state) => {
                state.loading = true
                state.error = null
            })
            .addCase(fetchFilesData.fulfilled, (state, action) => {
                state.loading = false
                state.files = action.payload
            })
            .addCase(fetchFilesData.rejected, (state, action) => {
                state.loading = false
                state.error = action.payload
            })

            // --- Manejo de fetchFileList ---
            .addCase(fetchFileList.fulfilled, (state, action) => {
                state.fileList = action.payload
            })
    }
})

export const { setSelectedFile } = dataSlice.actions
export default dataSlice.reducer
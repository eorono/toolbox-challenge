# Toolbox Full Stack Challenge 🧰

Este repositorio contiene la solución al challenge técnico Full Stack, implementando un API REST en **NodeJS 14** y un cliente Frontend en **React (NodeJS 16)**.

## 🚀 Características Implementadas

### Obligatorias
- **API (Node 14):** Descarga, parseo y formateo de archivos CSV desde API externa.
- **Frontend (React + Bootstrap):** Visualización de datos en tabla responsiva.
- **Testing:** Tests unitarios del API usando Mocha + Chai.

### Puntos Opcionales (Bonus)
- ✅ **Dockerizado:** Ejecución completa con `docker-compose` (Backend + Frontend).
- ✅ **Endpoint `/files/list`:** Nuevo endpoint para listar archivos disponibles.
- ✅ **Filtrado Backend:** Soporte de query param `?fileName=...` para optimizar descargas.
- ✅ **UX Frontend:** Búsqueda híbrida (Input de texto + Autocompletado con Datalist) basada en los archivos reales del servidor.
- ✅ **Manejo de Errores:** Resiliencia ante archivos corruptos o fallos del API externo.

---

## 🛠️ Cómo ejecutar el proyecto (Recomendado)

La forma más sencilla de correr la aplicación es usando **Docker**, ya que maneja automáticamente las versiones de Node requeridas (14 y 16).

### Requisitos
- Docker & Docker Compose

### Instrucciones
1. Clonar el repositorio.
2. Ejecutar el siguiente comando en la raíz:

```bash
docker-compose up --build
```

3. Acceder a la aplicación:
    - Frontend: http://localhost:3001
    - API: http://localhost:3000


## ⚙️ Ejecución Manual (Sin Docker)

### Si prefieres correrlo localmente, necesitarás gestionar las versiones de Node (ej. usando nvm).

1. Backend (API)

    Requiere NodeJS 14.
    Bashcd server
    npm install
    npm start
    # El servidor correrá en http://localhost:3000
    Para correr los tests:Bashnpm test

2. Frontend (React)

    Requiere NodeJS 16 (o superior compatible).
    Bashcd client
    npm install
    npm start
    # La app abrirá en http://localhost:3001

🧪 API Endpoints

Método | Endpoint | Descripción
--- | --- | ---
GET | /files/data | Retorna todos los archivos formateados.
GET | /files/data?fileName=test2.csv | Retorna datos de un archivo específico.
GET | /files/list | Retorna la lista de nombres de archivos disponibles.
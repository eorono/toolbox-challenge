# Usamos una imagen ligera de Node 14 (Alpine Linux)
FROM node:14-alpine

# Creamos el directorio de trabajo dentro del contenedor
WORKDIR /app

# Copiamos primero los archivos de dependencias (para aprovechar el caché de Docker)
COPY package*.json ./

# Instalamos las dependencias
RUN npm install

# Copiamos el resto del código fuente
COPY . .

# Exponemos el puerto 3000
EXPOSE 3000

# Comando para iniciar el servidor
CMD ["npm", "start"]
# Usamos Node 16 como pide el requisito del Frontend
FROM node:16-alpine

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

# Exponemos el puerto 3001 (donde correrá React)
EXPOSE 3001

# Iniciamos la aplicación
CMD ["npm", "start"]
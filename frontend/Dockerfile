# Usar imagen base ligera oficial de Node
FROM node:18-alpine

# Establecer directorio de trabajo en el contenedor
WORKDIR /app

# Copiar archivos de control de dependencias
COPY package.json /app/
RUN npm install

# Copiar el código fuente del proyecto frontend
COPY . /app/

# Exponer el puerto de desarrollo de Vite
EXPOSE 3000

# Ejecutar el servidor de desarrollo exponiendo el host en la red de Docker
CMD ["npm", "run", "dev", "--", "--host"]

FROM node:20-alpine

# Instalar dependencias del sistema para el driver de MariaDB/MySQL
RUN apk add --no-cache python3 make g++

WORKDIR /app

# Copiar archivos de configuración
COPY package.json package-lock.json* ./

# Instalar dependencias
RUN npm ci

# Copiar el código fuente
COPY . .

# Construir la aplicación
RUN npm run build

# Limpiar dependencias de desarrollo y mantener solo las de producción
RUN npm prune --production

# Exponer el puerto
EXPOSE 8086

# Comando para iniciar la aplicación
CMD ["npm", "run", "start:prod"] 
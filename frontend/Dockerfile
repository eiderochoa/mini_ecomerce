# frontend/Dockerfile
FROM node:20-slim

WORKDIR /app

# Copiar archivos de dependencias para aprovechar la caché de capas de Docker
COPY package*.json ./

# Instalar dependencias
RUN npm install

# Copiar el resto del código
COPY . .

# Exponer el puerto por defecto de Vite
EXPOSE 5173

# Arrancar el servidor de desarrollo mapeando el host para que sea accesible externamente
CMD ["npm", "run", "dev", "--", "--host"]
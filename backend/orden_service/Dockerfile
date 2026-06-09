# Dockerfile
FROM python:3.11-slim

# Evita que Python escriba archivos .pyc en el contenedor
ENV PYTHONDONTWRITEBYTECODE=1
# Evita que Python almacene en búfer los flujos de salida (logs inmediatos)
ENV PYTHONUNBUFFERED=1

WORKDIR /app

# Instalar dependencias del sistema necesarias (por ejemplo, para compilar ciertas librerías)
RUN apt-get update && apt-get install -y --no-install-recommends \
    gcc \
    libc-dev \
    && rm -rf /var/lib/apt/lists/*

# Copiar e instalar requerimientos
COPY requirements.txt /app/
RUN pip install --no-cache-dir -r requirements.txt

# Copiar el resto del código del microservicio
COPY . /app/

# Comando por defecto para encender el servidor de desarrollo de Django
CMD ["python", "manage.py", "runserver", "0.0.0.0:8000"]
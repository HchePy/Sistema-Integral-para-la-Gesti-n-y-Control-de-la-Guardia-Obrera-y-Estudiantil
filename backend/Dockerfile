# Usar imagen base ligera oficial de Python
FROM python:3.10-slim

# Evitar que Python escriba archivos .pyc en el disco
ENV PYTHONDONTWRITEBYTECODE 1
# Evitar que Python almacene en búfer stdout y stderr
ENV PYTHONUNBUFFERED 1

# Establecer directorio de trabajo en el contenedor
WORKDIR /app

# Instalar dependencias necesarias para WeasyPrint (compilación de PDF)
RUN apt-get update && apt-get install -y --no-install-recommends \
    build-essential \
    python3-dev \
    libpango-1.0-0 \
    libharfbuzz0b \
    libpangoft2-1.0-0 \
    libjpeg-dev \
    libopenjp2-7-dev \
    libffi-dev \
    shared-mime-info \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/*

# Instalar requerimientos de Python
COPY requirements.txt /app/
RUN pip install --no-cache-dir -r requirements.txt

# Copiar el código fuente del proyecto backend
COPY . /app/

# Exponer el puerto del servidor de desarrollo
EXPOSE 8000

# Comando para ejecutar con Gunicorn en producción
CMD ["gunicorn", "--bind", "0.0.0.0:8000", "config.wsgi:application"]

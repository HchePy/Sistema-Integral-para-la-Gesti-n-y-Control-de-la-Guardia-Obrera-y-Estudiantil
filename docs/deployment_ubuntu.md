# Guía de Despliegue en Producción (Ubuntu Server & DevOps)

Esta guía detalla la metodología técnica para desplegar el **Sistema de Informatización UHO** en servidores de producción institucional con **Ubuntu Server 22.04 LTS** y automatizar la integración continua mediante **GitLab CI/CD**.

---

## 1. Configuración del Servidor de Base de Datos (PostgreSQL)

1. Instalar PostgreSQL en Ubuntu:
   ```bash
   sudo apt update
   sudo apt install postgresql postgresql-contrib -y
   ```
2. Crear usuario y base de datos institucional:
   ```bash
   sudo -i -u postgres psql
   # Dentro de la consola psql:
   CREATE DATABASE uho_db;
   CREATE USER uho_user WITH PASSWORD 'uho_password';
   ALTER ROLE uho_user SET client_encoding TO 'utf8';
   ALTER ROLE uho_user SET default_transaction_isolation TO 'read committed';
   ALTER ROLE uho_user SET timezone TO 'America/Havana';
   GRANT ALL PRIVILEGES ON DATABASE uho_db TO uho_user;
   \q
   ```

---

## 2. Configuración del Backend (Gunicorn & Systemd)

1. Clonar el código del backend en `/var/www/uho-backend` e instalar el entorno virtual de Python:
   ```bash
   sudo mkdir -p /var/www/uho-backend
   sudo chown -R $USER:$USER /var/www/uho-backend
   # Copiar código del backend
   cd /var/www/uho-backend
   python3 -m venv .venv
   source .venv/bin/activate
   pip install -r requirements.txt
   ```
2. Configurar el archivo `.env` con variables seguras de producción:
   ```ini
   SECRET_KEY=clave-secreta-produccion-uho-2026
   DEBUG=False
   ALLOWED_HOSTS=192.168.1.100,uho.edu.cu
   DATABASE_URL=postgres://uho_user:uho_password@localhost:5432/uho_db
   ```
3. Crear un archivo de servicio de Systemd para Gunicorn `/etc/systemd/system/gunicorn.service`:
   ```ini
   [Unit]
   Description=gunicorn daemon for UHO Backend
   After=network.target

   [Service]
   User=www-data
   Group=www-data
   WorkingDirectory=/var/www/uho-backend
   ExecStart=/var/www/uho-backend/.venv/bin/gunicorn \
             --access-logfile - \
             --workers 3 \
             --bind unix:/run/gunicorn.sock \
             config.wsgi:application

   [Install]
   WantedBy=multi-user.target
   ```
4. Iniciar y habilitar el daemon de Gunicorn:
   ```bash
   sudo systemctl start gunicorn
   sudo systemctl enable gunicorn
   ```

---

## 3. Configuración del Servidor Web (Nginx)

Nginx actuará como proxy inverso para enrutar el tráfico HTTP y servir los archivos estáticos compilados del Frontend de React.

1. Instalar Nginx:
   ```bash
   sudo apt install nginx -y
   ```
2. Compilar el Frontend localmente o en el servidor:
   ```bash
   cd /var/www/uho-frontend
   npm install
   npm run build
   # Los archivos compilados optimizados se generarán en la carpeta /dist
   ```
3. Crear un archivo de configuración de bloque de servidor Nginx `/etc/nginx/sites-available/uho`:
   ```nginx
   server {
       listen 80;
       server_name uho.edu.cu 192.168.1.100;

       # Frontend de React (Archivos Estáticos)
       location / {
           root /var/www/uho-frontend/dist;
           index index.html index.htm;
           try_files $uri $uri/ /index.html;
       }

       # Archivos Estáticos del Backend de Django
       location /static/ {
           alias /var/www/uho-backend/staticfiles/;
       }

       # Proxy Inverso para la API REST del Backend (Django Gunicorn)
       location /api/ {
           include proxy_params;
           proxy_pass http://unix:/run/gunicorn.sock;
       }

       # Panel de Administración de Django
       location /admin/ {
           include proxy_params;
           proxy_pass http://unix:/run/gunicorn.sock;
       }
   }
   ```
4. Habilitar la configuración y reiniciar Nginx:
   ```bash
   sudo ln -s /etc/nginx/sites-available/uho /etc/nginx/sites-enabled/
   sudo nginx -t
   sudo systemctl restart nginx
   ```

---

## 4. Tubería de Integración Continua (GitLab CI/CD)

En las instituciones cubanas, **GitLab** es el servidor de control de versiones preferido. Creamos el archivo `.gitlab-ci.yml` para automatizar pruebas sintácticas de calidad y despliegues automáticos a producción tras cada confirmación (`git push`) en la rama `main`.

Crear el archivo `.gitlab-ci.yml` en la raíz del proyecto:
```yaml
stages:
  - test
  - build
  - deploy

# Etapa de Pruebas Sintácticas del Backend (Django Linter)
test_backend:
  stage: test
  image: python:3.10-slim
  script:
    - cd backend
    - pip install -r requirements.txt
    - python manage.py check

# Etapa de Pruebas del Frontend (Compilación React)
test_frontend:
  stage: test
  image: node:18-alpine
  script:
    - cd frontend
    - npm install
    - npm run build

# Construcción de Contenedores de Producción (Opcional)
build_docker:
  stage: build
  image: docker:latest
  services:
    - docker:dind
  script:
    - docker build -t registry.uho.edu.cu/informatizacion/frontend:latest ./frontend
    - docker build -t registry.uho.edu.cu/informatizacion/backend:latest ./backend
  only:
    - main

# Despliegue Automatizado por Llaves SSH al Servidor Ubuntu
deploy_to_prod:
  stage: deploy
  image: alpine:latest
  before_script:
    - apk add --no-cache openssh-client
    - eval $(ssh-agent -s)
    - echo "$SSH_PRIVATE_KEY" | tr -d '\r' | ssh-add -
    - mkdir -p ~/.ssh
    - chmod 700 ~/.ssh
  script:
    # Conectarse por SSH y actualizar código en el servidor
    - ssh -o StrictHostKeyChecking=no deploy_user@192.168.1.100 "cd /var/www/uho-backend && git pull origin main && source .venv/bin/activate && pip install -r requirements.txt && python manage.py migrate && sudo systemctl restart gunicorn"
  only:
    - main
```

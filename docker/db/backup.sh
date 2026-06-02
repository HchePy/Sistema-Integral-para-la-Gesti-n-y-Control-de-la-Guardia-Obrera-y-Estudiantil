#!/bin/bash
# ==============================================================================
# Script de Backup en Caliente para PostgreSQL - Universidad de Holguín (UHO)
# Diseñado para entornos de producción DevOps.
# ==============================================================================

# Detener ejecución si hay un error
set -e

# Configuración de variables
DB_CONTAINER_NAME="uho_postgres_db"
DB_NAME="uho_db"
DB_USER="uho_user"
BACKUP_DIR="/var/lib/postgresql/data/backups"
DATE=$(date +%Y-%m-%d_%H-%M-%S)
BACKUP_FILE="${BACKUP_DIR}/uho_backup_${DATE}.sql.gz"

echo "[INFO] Iniciando proceso de copia de seguridad..."

# Verificar si el directorio de backups existe dentro del contenedor
docker exec -t ${DB_CONTAINER_NAME} mkdir -p ${BACKUP_DIR}

# Ejecutar pg_dump y comprimir el resultado en caliente
echo "[INFO] Volcando base de datos '${DB_NAME}' a archivo comprimido..."
docker exec -t ${DB_CONTAINER_NAME} pg_dump -U ${DB_USER} -d ${DB_NAME} | gzip > ${BACKUP_FILE}

echo "[SUCCESS] Copia de seguridad completada con éxito: ${BACKUP_FILE}"

# Limpieza automática: Eliminar backups con más de 7 días de antigüedad
echo "[INFO] Depurando copias de seguridad antiguas (mayores a 7 días)..."
docker exec -t ${DB_CONTAINER_NAME} find ${BACKUP_DIR} -name "uho_backup_*.sql.gz" -mtime +7 -delete

echo "[SUCCESS] Tareas de mantenimiento de base de datos finalizadas."

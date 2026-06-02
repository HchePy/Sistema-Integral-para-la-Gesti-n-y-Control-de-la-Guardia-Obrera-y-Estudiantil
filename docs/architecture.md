# Arquitectura del Sistema de Gestión y Control de la Guardia (SIGCGOE - UHO)

Este documento describe la base técnica del **Sistema Integral para la Gestión y Control de la Guardia Obrera y Estudiantil (SIGCGOE)** de la **Universidad de Holguín (UHO)**. El sistema está construido con un enfoque deslocalizado e independiente para el Frontend y el Backend.

---

## 1. Diseño Deslocalizado (Frontend y Backend Separados)

El sistema separa estrictamente la capa de presentación (UI) de la capa lógica de negocio (API), lo que permite escalabilidad independiente y tolerancia a fallos.

```text
                  ┌──────────────────────────────┐
                  │      React SPA Frontend      │
                  │        (Puerto 5173)         │
                  └──────────────┬───────────────┘
                                 │
                     Peticiones HTTP / HTTPS
                     Tokens Bearer JWT
                                 │
                                 ▼
                  ┌──────────────────────────────┐
                  │      Django REST API         │
                  │        (Puerto 8000)         │
                  └──────┬────────────────┬──────┘
                         │                │
                Consultas SQL      Almacenamiento S3
                         │                │
                         ▼                ▼
                  ┌──────────────┐ ┌──────────────┐
                  │  PostgreSQL  │ │  MinIO S3    │
                  │ (Puerto 5432)│ │ (Puerto 9000)│
                  └──────────────┘ └──────────────┘
```

---

## 2. Modularidad Escalable (Estructura de Módulos de Guardia)

El backend de Django está estructurado dentro de la carpeta `modules/` para alojar los submódulos de la guardia de forma independiente:

*   **Administración General (`modules/guardia_admin/`)**: Gestión de nomencladores (sedes, áreas, departamentos, tipos de guardia, cargos) y sincronización con registros primarios (ASSET y SIGENU).
*   **Compromisos (`modules/compromiso/`)**: Firma digital de compromisos de guardia obrera y estudiantil con preselección inteligente de preferencias.
*   **Gestión de Potencial (`modules/potencial/`)**: Revisión y aprobación del listado de potencial por departamento y áreas, bloqueando la edición tras la confirmación de la jefatura.
*   **Distribución de Guardia (`modules/distribucion/`)**: Asignación de días mensuales por área y asignación individual de guardias obreros y estudiantes.
*   **Control y Evaluación (`modules/control/`)**: Registro de cumplimiento en tiempo real, evaluaciones (B/R/M) y observaciones.
*   **Reportes y Analítica (`modules/reportes/`)**: Dashboard gráfico y exportación asíncrona de reportes a PDF (WeasyPrint) y Excel.

---

## 3. Seguridad Basada en Roles de Guardia (RBAC)

El acceso a las APIs y la interfaz de usuario está restringido mediante un control lógico basado en la estructura de roles del sistema de guardia:

1.  **SUPERADMIN**: Acceso total a nomencladores, logs de auditoría global e importaciones.
2.  **JEFE_SEGURIDAD**: Responsable global de la distribución física de la guardia por sedes y reportes de cumplimiento.
3.  **RESPONSABLE_AREA**: Aprobación del potencial del área/facultad y distribución de días.
4.  **RESPONSABLE_DEPARTAMENTO**: Asignación de trabajadores específicos a los días correspondientes.
5.  **TRABAJADOR**: Consulta de perfil propio, firma de compromiso y cronograma anual de guardia obrera.
6.  **ESTUDIANTE**: Consulta de perfil propio, firma de compromiso y cronograma anual de guardia estudiantil.

### Lógica de Permisos en el Backend (DRF):
Utiliza la clase de permiso avanzada `HasRole` definida en `core/rbac.py`:
```python
# Ejemplo en el módulo de Potencial (potencial/views.py)
permission_classes = [IsAuthenticated, HasRole.for_roles(ROLE_SUPERADMIN, ROLE_RESPONSABLE_AREA)]
```

---

## 4. Trazabilidad y Registros de Auditoría

El sistema implementa una auditoría institucional rigurosa a través de la clase base abstracta `AuditableModel` (`core/models.py`) y un middleware de request (`AuditMiddleware`):

*   **Captura automática**: Captura el usuario autenticado actualmente y su dirección IP de origen en cada petición HTTP, sin ensuciar el código de las vistas.
*   **Registros CRUD en Base de Datos**: Intercepta automáticamente las llamadas a `.save()` y `.delete()` del ORM de Django y escribe un reporte en la tabla `AuditLog` detallando el tipo de acción (`CREAR`, `MODIFICAR`, `ELIMINAR`), la tabla afectada, el identificador único del registro y la marca de tiempo.

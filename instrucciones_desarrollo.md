# 📜 Instrucciones y Especificaciones de Desarrollo de la Guardia (SIGCGOE)

Este documento contiene las reglas, restricciones y preferencias que el asistente de IA (**Antigravity**) debe recordar y respetar de forma obligatoria al inicio de cada sesión de trabajo.

---

## 📁 1. Restricción de Carpetas y Modificación de Código
* **Única carpeta modificable:** `Entorno de Trabajo UHO` (contiene el código del frontend, backend, docker, y la documentación del proyecto).
* **Documentos informativos (NO MODIFICAR):** Los archivos y carpetas fuera de `Entorno de Trabajo UHO` (como `DIagramas/`, `Plantilla informe PP.docx`, `Prácticas 3ro año - Junio 2026.pdf`, `Sistema para la Gestión y Control de la Guardia (SIGCGOE)_Requerimientos.txt`, etc.) son de carácter informativo o entregables de diagramación. **No deben ser modificados por la IA**.

---

## 🚶‍♂️ 2. Metodología de Trabajo: Paso a Paso
* **Proceso Incremental:** Las modificaciones y el desarrollo deben realizarse de forma secuencial, paso a paso.
* **Validación Constante:** No se deben escribir múltiples componentes o lógica compleja a la vez. Se debe avanzar en un requerimiento, probar, reportar al usuario, y esperar instrucciones para el siguiente.
* **Diseño del Sistema (ICONIX):** Mantener la separación de interfaces, controladores y entidades según la modelación de casos de uso del sistema.

---

## 🏛️ 3. Arquitectura del Sistema
* **Frontend:** Single Page Application (SPA) en React.js (empaquetado con Vite), puerto por defecto `5173`.
* **Backend:** Django REST Framework (Python 3.10+), puerto por defecto `8000`.
* **Base de Datos:** PostgreSQL (Producción) / SQLite (Desarrollo).
* **Autenticación:** A través de `AGA_AUTH` (`auth.uho.edu.cu`). No almacenar contraseñas de usuarios en la base de datos local. Las sesiones se validan con tokens **JWT**.
* **Trazabilidad de Auditoría (Requisito OSRI):** Toda operación CRUD debe registrarse automáticamente en la tabla de base de datos `AuditLog` mediante el middleware `AuditMiddleware` y el modelo abstracto `AuditableModel`, guardando:
  * ID de Usuario.
  * Acción realizada (`CREAR`, `MODIFICAR`, `ELIMINAR`).
  * Nombre de la tabla/modelo.
  * ID del objeto afectado.
  * Dirección IP de origen (real, manejando cabeceras detrás de Nginx).
  * Marca de tiempo (Timestamp).

---

## 🛡️ 4. Reglas de Negocio Estrictas (UHO)
* **RN-01 (Cálculo de Edad):** Calcular automáticamente la edad a partir de los primeros 6 dígitos del carné de identidad cubano (AAMMDD), con lógica de cambio de siglo (año > año actual = 19xx; de lo contrario = 20xx).
* **RN-10 (Protección de Datos - Enmascaramiento del CI):** En cualquier listado público, reporte o exportación de datos, los dígitos intermedios del CI deben ocultarse en formato `######-####`. Solo se permite ver el CI completo en la pantalla de perfil propio del usuario o con rol `SUPERADMIN`.
* **RN-04 (Cierre Irreversible de Potencial):** Cuando el Responsable de Área/Departamento aprueba y firma el Potencial del período, el listado se bloquea de forma irreversible en modo solo lectura. Solo el `SUPERADMIN` puede volver a habilitar su edición.
* **RN-06 (Guardia Estudiantil Segmentada):** Solo los departamentos con el flag `tieneEstudiantes` activo en la base de datos pueden recibir y distribuir turnos de Guardia Estudiantil.
* **RN-07 (Validación de Mínimos por Sede):** Advertir en rojo/alerta si la asignación de guardias diarios nominales es inferior al mínimo de seguridad establecido para esa sede.
* **RN-09 (Evaluaciones de Guardia):** Las calificaciones permitidas para el registro diario son únicamente **B (Bien)**, **R (Regular)** y **M (Mal)**. Si hay inasistencia, el campo de evaluación debe quedar en blanco de forma obligatoria y marcarse la ausencia.

---

## 🎨 5. Diseño y Estética Visual
* **Estilo Premium:** Moderno, vibrante, con soporte para modo oscuro adaptado a los colores de la UHO, gradientes suaves, micro-animaciones y efectos de glassmorphism.
* **Componentes Reutilizables:** Evitar crear interfaces excesivamente genéricas o básicas. Mantener la consistencia del diseño utilizando la paleta de colores y componentes ya construidos.

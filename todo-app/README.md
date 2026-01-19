# TO-DO App

Aplicación web para la administración de tareas personales, desarrollada como prueba técnica.
Permite a cada usuario gestionar sus propias tareas de forma segura, con notificaciones automáticas y sincronización en tiempo real.

---

## Tecnologías utilizadas

- **React** (Vite)
- **Firebase Authentication**
- **Firebase Firestore**
- **Tailwind CSS**
- **JavaScript (ES6+)**

---

## Funcionalidades principales

- Registro e inicio de sesión de usuarios
- Gestión de tareas (crear, editar, completar y eliminar)
- Prioridades de tareas (baja, media, alta)
- Clasificación por estado:
  - Todas
  - Pendientes
  - Realizadas
- Ordenamiento por fecha, hora y prioridad
- Notificaciones automáticas:
  - 10 minutos antes de la tarea
  - En el momento exacto de la tarea
- Indicadores visuales:
  - Color amarillo cuando la tarea está próxima
  - Color rojo cuando la tarea está vencida
- Interfaz moderna, responsiva e intuitiva
- Persistencia de datos en tiempo real por usuario

---

## Seguridad y usuarios

- Autenticación gestionada mediante Firebase Authentication
- Cada usuario solo puede acceder a sus propias tareas
- Datos almacenados de forma segura en Firestore

---

## Instalación y ejecución local

```bash
# Clonar repositorio
git clone <URL_DEL_REPOSITORIO>

# Instalar dependencias
npm install

# Ejecutar proyecto
npm run dev

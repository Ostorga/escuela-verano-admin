# Escuela de Verano — Panel administrativo

Aplicación inicial para administrar las inscripciones de una escuela de verano.

## Tecnologías
- Next.js (App Router)
- React
- TypeScript
- Tailwind CSS
- Node.js
- Lucide React para iconos

## Requisitos
- Node.js 20.9 o superior
- npm

## Instalación y ejecución

Abre esta carpeta en VS Code y ejecuta en la terminal:

```bash
npm install
npm run dev
```

Después abre http://localhost:3000.

Para generar una compilación de producción:

```bash
npm run build
npm start
```

## Funcionalidades iniciales
- Listado de niños inscritos.
- Crear, editar y eliminar inscripciones.
- Estado de pago de inscripción.
- Taller asignado.
- Búsqueda por nombre del niño o encargado.
- Filtro por estado de pago.
- Paginación de 10 registros.
- Sesiones persistentes con Firebase Authentication.

## Acceso administrativo
- El panel requiere una sesión activa de Firebase Authentication.
- Inicia sesión con el correo y la contraseña de la cuenta administradora creada en Firebase Console; no hay registro desde la aplicación.
- Habilita el proveedor **Correo electrónico/contraseña** en Firebase Authentication.
- La aplicación usa la configuración Firebase ya existente en `app/lib/firebase/config.ts` y conserva las reglas actuales de Firestore.

## Estructura

```text
app/
  globals.css       # Estilos y configuración de Tailwind
  layout.tsx        # Layout principal
  page.tsx          # Estado y lógica de inscripciones
  components/
    auth-provider.tsx    # Estado y protección de la sesión Firebase
    login-form.tsx       # Inicio de sesión administrativo
    dropdown-select.tsx  # Selector desplegable reutilizable
    enrollment-modal.tsx # Formulario de inscripción
    navbar.tsx           # Barra superior
    pagination.tsx       # Paginación de registros
    sidebar.tsx          # Menú lateral
    students-table.tsx   # Tabla, búsqueda y filtros
    summary-cards.tsx    # Tarjetas de resumen
  lib/
    students.ts     # Datos iniciales y utilidades de estudiantes
    firebase/
      auth-errors.ts # Mensajes de autenticación para el usuario
      config.ts      # Inicialización compartida de Firebase
      students.ts   # Lectura en tiempo real de estudiantes
  types/
    student.ts      # Tipos de estudiante y formulario
```

## Datos de estudiantes
La lista de estudiantes se lee desde la colección `students` de Firestore y se mantiene sincronizada en tiempo real. Firestore requiere una sesión autenticada conforme a las reglas de seguridad del proyecto.

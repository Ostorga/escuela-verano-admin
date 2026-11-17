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
- Persistencia local mediante `localStorage`.

## Estructura

```text
app/
  globals.css       # Estilos y configuración de Tailwind
  layout.tsx        # Layout principal
  page.tsx          # Panel y lógica de inscripciones
```

## Nota sobre los datos
Esta primera versión guarda la información en el navegador mediante `localStorage`. Es ideal para el prototipo y para comenzar a trabajar la interfaz. Para usarla con varios usuarios o dispositivos, el siguiente paso será conectar una base de datos y una API en Node.js.

# Churrería Churroberto

Sistema web de la Churrería Churroberto (José Pascual Tamborini 6186, Villa Urquiza, CABA): menú, carrito, pedidos con retiro o envío y panel de administración.

```
ritter-santiago-churroberto/
├── backend/    API REST con Express y patrón MVC (datos en memoria)
├── frontend/   Sitio en React (Entrega 3)
└── docs/       Diagrama del dominio y boceto de diseño
```

## Estado de las entregas

| Entrega | Contenido | Estado |
|---|---|---|
| 1 | Repositorio, diagrama de clases y modelos del dominio | Hecha |
| 2 | API con MVC, CRUD de productos, manejo central de errores | Hecha |
| 3 | Frontend en React conectado a la API | En curso |

## Cómo correr el backend

Requiere Node 20 o superior.

```bash
cd backend
npm install
cp .env.example .env     # opcional en desarrollo
npm run dev              # http://localhost:3000
npm test                 # tests de la API
```

En desarrollo, si no hay `.env`, se crea un administrador con el email `admin@churroberto.com` y la contraseña `admin1234`. En producción `JWT_SECRET` y `ADMIN_PASSWORD` son obligatorias. Los datos viven en memoria: al reiniciar la API vuelven al estado inicial.

## Datos de ejemplo

El local no publica su carta. Los **productos, precios y stock del menú son de ejemplo** (`backend/src/repositories/datosIniciales.js`) y hay que reemplazarlos por los reales. El teléfono y el WhatsApp del local tampoco están cargados. La dirección, los horarios y las coordenadas salen de listados públicos del local, y las tres reseñas son textos de reseñas públicas en internet que conviene confirmar con el dueño.

## Diseño

El boceto está en `docs/boceto/index.html` (ábrelo en el navegador). La dirección visual es un "plano de patente": láminas color fritura, cajetín, sellos y un churro 3D que cambia de pose según la sección mientras se hace scroll.

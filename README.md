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
| 3 | Frontend en React conectado a la API | Hecha |

## Cómo correr el proyecto

Requiere Node 20 o superior. Se necesitan dos terminales: una para la API y otra para el sitio.

```bash
# Terminal 1: API
cd backend
npm install
cp .env.example .env     # opcional en desarrollo
npm run dev              # http://localhost:3000
npm test                 # tests de la API

# Terminal 2: sitio
cd frontend
npm install
npm run dev              # http://localhost:5173
```

En desarrollo, si no hay `.env`, se crea un administrador con el email `admin@churroberto.com` y la contraseña `admin1234`. En producción `JWT_SECRET` y `ADMIN_PASSWORD` son obligatorias. Los datos viven en memoria: al reiniciar la API vuelven al estado inicial.

Para entrar al panel del local: `http://localhost:5173/ingresar` con la cuenta administradora, y después "Administrar" en la cabecera.

## Publicación

- **Sitio (Vercel):** carpeta `frontend/`, proyecto `churroberto-web`. Necesita la variable `VITE_API_URL` con la dirección pública de la API.
- **API (Render):** `render.yaml` en la raíz describe el servicio. Se crea desde el panel de Render con *New → Blueprint* sobre este repo; Render pide la contraseña del administrador (`ADMIN_PASSWORD`) y genera sola la firma de sesiones (`JWT_SECRET`).

La API guarda todo en memoria, como pide la consigna. En el plan gratuito de Render el servicio se duerme tras 15 minutos sin visitas y, al despertar, vuelve a los datos de ejemplo: las cuentas y pedidos hechos antes se pierden, y la primera visita tarda cerca de un minuto. Tampoco sirve correrla en Vercel: allí cada consulta puede caer en una copia distinta de la API con sus propios datos.

## Datos de ejemplo

El local no publica su carta. Los **productos, precios y stock del menú son de ejemplo** (`backend/src/repositories/datosIniciales.js`) y hay que reemplazarlos por los reales. El teléfono y el WhatsApp del local tampoco están cargados. La dirección, los horarios y las coordenadas salen de listados públicos del local, y las tres reseñas son textos de reseñas públicas en internet que conviene confirmar con el dueño.

## Diseño

La dirección visual es un pliego de stickers de kiosco: campos de color plano, bordes troquelados, letras gordas y un churro 3D que rueda, gira y se abre en corte mientras se hace scroll. Las capturas de referencia están en `docs/boceto/` y el sistema de diseño en `DESIGN.md`.

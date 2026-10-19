# Frontend de Churroberto

Sitio en React (Vite) que consume la API del backend.

## Cómo correrlo

Requiere Node 20 o superior y la API corriendo en `http://localhost:3000` (ver `backend/README.md`).

```bash
npm install
cp .env.example .env     # opcional: solo para cambiar la URL de la API
npm run dev              # http://localhost:5173
npm run build            # versión de producción en dist/
```

`VITE_API_URL` define la dirección de la API. El navegador necesita que esa dirección esté permitida en `CORS_ORIGIN` del backend.

## Estructura de `src/`

| Carpeta | Responsabilidad |
|---|---|
| `components/ui` | Piezas reutilizables: botón, campos, estados, íconos, ilustraciones |
| `components/layout` | Cabecera, pie, marco de la app, rutas protegidas, pantalla de error |
| `components/feedback` | Avisos (toasts) y diálogo de confirmación |
| `components/effects` | Efectos de scroll y entrada: cintas, titulares partidos, sello, cursor, pantalla de carga |
| `components/churro3d` | El churro 3D: geometría, textura, poses y lienzo |
| `components/sections` | Secciones de la portada |
| `components/productos` | Ficha de producto |
| `pages` | Pantallas completas (`pages/admin` para el panel) |
| `services` | **Toda** la comunicación con la API: `http.js` más un archivo por recurso |
| `context` | Sesión, carrito, avisos y confirmaciones |
| `hooks` | Carga de datos, scroll, media queries, título de la página |
| `utils` | Formatos, validaciones, horarios, scroll suave |
| `styles` | Tokens y hojas de estilo compartidas |

Los componentes y páginas nunca llaman a `fetch`: usan las funciones de `services`. Ningún dato de negocio (productos, horarios, reseñas) está escrito en los componentes.

## Pantallas

Inicio, menú con filtro por categoría, detalle de producto, pedido (retiro o envío), confirmación, ingreso y registro, mis pedidos con cancelación, y el panel del local (productos con alta, edición y baja, y pedidos con cambio de estado). El panel solo lo ve una cuenta administradora.

El carrito se guarda en el navegador. Al confirmar, se copia al carrito de la cuenta en la API, que valida stock y precios, y recién ahí se crea el pedido.

## Accesibilidad

Etiquetas asociadas a cada campo, errores junto al campo con foco al primero, botones y enlaces semánticos, enlace para saltar al contenido, un `h1` por pantalla, foco visible, diálogo nativo con foco atrapado y cierre con Esc, y respeto de `prefers-reduced-motion`. Auditoría con axe-core: 0 problemas en las páginas públicas.

El diseño está documentado en `../DESIGN.md`.

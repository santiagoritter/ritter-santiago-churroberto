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
| `components/productos` | Ficha de producto y herramientas del menú (categorías, búsqueda, orden) |
| `components/pedidos` | Seguimiento del pedido por pasos |
| `components/carrito` | Cajón lateral del pedido |
| `pages` | Pantallas completas (`pages/admin` para el panel) |
| `services` | **Toda** la comunicación con la API: `http.js` más un archivo por recurso |
| `context` | Sesión, carrito, avisos y confirmaciones |
| `hooks` | Carga de datos, scroll, media queries, título, filtros del menú, animación FLIP, consulta periódica de pedidos |
| `utils` | Formatos, validaciones, horarios, scroll suave, filtrado del menú |
| `styles` | Tokens y hojas de estilo compartidas |

Los componentes y páginas nunca llaman a `fetch`: usan las funciones de `services`. Ningún dato de negocio (productos, horarios, reseñas) está escrito en los componentes.

## Pantallas

Inicio, menú, detalle de producto, pedido (retiro o envío), confirmación, ingreso y registro, mis pedidos y el panel del local. El panel solo lo ve una cuenta administradora.

Lo que se puede hacer:

- **Menú:** filtrar por categoría, buscar sin importar acentos ni mayúsculas y ordenar por precio o nombre. Todo queda en la dirección de la página (`?categoria=2&q=choco&orden=precio-asc`), así que se puede compartir y funciona el botón "atrás".
- **Pedido a mano:** el cajón lateral se abre desde la cabecera o desde el aviso "Ver pedido", con cantidades editables y el total actualizado.
- **Mis pedidos:** seguimiento por pasos que se actualiza solo (y avisa si el local cambia el estado), cancelación mientras está pendiente y "Pedir de nuevo", que arma el carrito con los precios y el stock de hoy y avisa qué productos ya no están.
- **Panel del local:** productos con búsqueda, alta, edición con aviso de cambios sin guardar, baja con confirmación y etiquetas de poco stock o agotado; pedidos con filtro por estado (con contador) y botones con la acción que corresponde.

El carrito se guarda en el navegador. Al confirmar, se copia al carrito de la cuenta en la API, que valida stock y precios, y recién ahí se crea el pedido.

## Accesibilidad

Etiquetas asociadas a cada campo, errores junto al campo con foco al primero, botones y enlaces semánticos, enlace para saltar al contenido, un `h1` por pantalla, foco visible, diálogo nativo con foco atrapado y cierre con Esc, y respeto de `prefers-reduced-motion`. Auditoría con axe-core: 0 problemas en las páginas públicas.

El diseño está documentado en `../DESIGN.md`.

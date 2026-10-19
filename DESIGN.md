# Sistema de diseño

Pliego de stickers de kiosco. Cada sección es un campo de color plano; los elementos son stickers con borde troquelado blanco y sombra suave. Todo vive en `frontend/src/styles/` y se define con variables en `tokens.css`.

## Color

| Token | Valor | Uso |
|---|---|---|
| `--celeste` | `#5bc0f8` | Inicio y reseñas |
| `--manteca` | `#ffd84a` | Quiénes somos, local y menú completo |
| `--frutilla` | `#ff7db5` | Menú y pedido |
| `--chocolate` | `#3a1a10` | Cómo se hace y cierre |
| `--cacao` | `#2b120b` | Texto y bordes |
| `--azucar` | `#ffffff` | Superficies y resaltes |
| `--caramelo`, `--dulce` | `#e3a03b`, `#c57a1e` | El churro y el relleno |
| `--error`, `--exito` | `#b42a18`, `#0d6e47` | Estados, siempre con texto y no solo color |

Cacao sobre cada campo cumple contraste AA (medido con axe-core, 0 problemas en las páginas públicas). Sobre chocolate el texto es blanco.

## Tipografía

- Títulos: **Bagel Fat One** (autohospedada con `@fontsource`).
- Texto y controles: **Hanken Grotesk** variable.
- Escala fluida con `clamp()`. Los titulares llegan a 6 rem. El cierre ("¿Una docena?") y la palabra de contorno del inicio son más grandes a propósito, como momento de remate y como adorno.

## Componentes

`components/ui` tiene los reutilizables: `Button`, `Field` (`Input`, `Textarea`, `Select`, `OpcionesTarjeta`), `QuantityStepper`, `Estados` (cargando, error, vacío, esqueleto), `Insignia`, `Icon`, `Estrella`, `ProductoArte`. Los avisos usan un único sistema (`ToastContext`) y las confirmaciones un único diálogo (`ConfirmContext`).

## Movimiento

| Efecto | Cómo se hace |
|---|---|
| Churro 3D que rueda y cambia de pose | React Three Fiber, geometría generada por código, poses en `churro3d/poses.js` |
| Corte con relleno | Plano de recorte animado con el scroll de la sección fijada |
| Sección "Cómo se hace" fijada | GSAP ScrollTrigger con `pin` |
| Texto que se enciende palabra por palabra | GSAP `scrub` |
| Titulares que suben desde una máscara | CSS (`transition`), activada con IntersectionObserver |
| Cintas de frases | CSS `animation`; aceleran con la velocidad del scroll |
| Sello giratorio y palabra gigante | CSS `animation-timeline: scroll()` |
| Fichas con parallax | CSS `animation-timeline: view()` |
| Pantalla de carga con franjas de toldo | CSS, solo la primera vez de cada sesión |
| Transición entre páginas | View Transitions de React Router |
| Scroll suave, cursor propio, botones magnéticos | Lenis y JavaScript; el cursor y el magnetismo solo con mouse |

**Reglas:** todo respeta `prefers-reduced-motion` (sin pantalla de carga, sin 3D en movimiento, cintas quietas, pasos siempre visibles). El contenido está en el HTML aunque falle JavaScript o WebGL; sin WebGL se muestra un dibujo 2D del churro. El único efecto con rebote es `--ease-pop`, usado en los stickers a propósito.

## Qué se evitó

Fondo crema con serif y terracota, tarjetas iguales como estructura, etiquetas en mayúsculas sobre los títulos, gradientes en texto, emojis como íconos, sombras duras desplazadas.

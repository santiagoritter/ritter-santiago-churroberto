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

`components/ui` tiene los reutilizables: `Button`, `Field` (`Input`, `Textarea`, `Select`, `OpcionesTarjeta`), `QuantityStepper`, `Estados` (cargando, error, vacío, esqueleto), `Insignia`, `Icon`, `Estrella` y `ProductoArte`. Este último dibuja cada producto en SVG: la docena y la media docena son la caja blanca atada con piolín, con la cantidad en un sticker (12 o 6); los rellenos llevan su gota de dulce de leche o chocolate. Los avisos usan un único sistema (`ToastContext`) y las confirmaciones un único diálogo (`ConfirmContext`).

## Movimiento

| Efecto | Cómo se hace |
|---|---|
| Churro 3D que rueda y cambia de pose | React Three Fiber, geometría generada por código, poses en `churro3d/poses.js`. Entra girando cuando termina la pantalla de carga |
| Borde blanco de sticker del churro | Dos pasos con el buffer de stencil: el churro marca su silueta y el borde, empujado un número fijo de píxeles, solo se dibuja fuera de esa marca (`churro3d/materialContorno.js`). Así no se cuela en los surcos ni cambia de grosor |
| Corte con relleno | Plano de recorte animado con el scroll de la sección fijada |
| Sección "Cómo se hace" fijada | GSAP ScrollTrigger con `pin` |
| Texto que se enciende palabra por palabra | GSAP `scrub` |
| Titulares que suben desde una máscara | CSS (`transition`), activada con IntersectionObserver |
| Cintas de frases | CSS `animation`; aceleran con la velocidad del scroll |
| Sello giratorio y palabra gigante | CSS `animation-timeline: scroll()` |
| Fichas con parallax | CSS `animation-timeline: view()` |
| Pantalla de carga con franjas de toldo | CSS, solo la primera vez de cada sesión |
| Transición entre páginas | View Transitions de React Router: la página nueva baja como una persiana |
| El producto vuela al carrito | Web Animations API sobre una copia del dibujo (`utils/volarAlCarrito.js`) |
| Estrella viajera en el borde de arriba | CSS `animation-timeline: scroll()`: una regla fina con una estrella que cruza la pantalla |
| Nombre gigante en el pie | CSS (contenido generado) que sube al entrar con `animation-timeline: view()` |
| Scroll suave, cursor propio, botones magnéticos | Lenis y JavaScript; el cursor y el magnetismo solo con mouse |
| Límites de velocidad | Una ráfaga de rueda no puede adelantar el destino más de 520 px (unos 2.400 px/s como tope). Los saltos por enlace duran lo que pide la distancia (entre 0,9 y 4 s, ease-in-out). El giro del churro tiene tope de 7 rad/s y las cintas aceleran como máximo 1,5× (`utils/smoothScroll.js`, `Churro.jsx`, `Marquee.jsx`) |
| Calidad 3D adaptable | `PerformanceMonitor` baja la resolución del lienzo si el equipo no sostiene los cuadros por segundo y la sube cuando puede |
| Cajón del pedido | `<dialog>` nativo que entra desde la derecha. Se abre desde la cabecera o desde el aviso "Ver pedido"; el total corre hasta su nuevo valor |
| Ficha con inclinación | Perspectiva CSS que sigue al puntero (solo con mouse), más chispas de estrellas al sumar |
| El churro reacciona | Al sumar algo o tocar un botón principal, el churro 3D pega un giro y se entusiasma (`reaccionarChurro` en `poses.js`) |
| Cabecera que se esconde | Se va al bajar y vuelve al subir, al enfocar algo con el teclado o al sumar un producto |
| Menú que se reordena | Al filtrar u ordenar, cada ficha se desliza a su nuevo lugar (técnica FLIP, `hooks/useFlip.js`) |
| Seguimiento del pedido | Pasos con marca que late en el paso actual; la pantalla consulta cada 20 s mientras la pestaña está a la vista y avisa si cambia el estado |
| Avisos con salida | Cada aviso se anima al entrar y al salir, y puede llevar un botón de acción |
| Cambio de página con elemento compartido | El dibujo del producto conserva su nombre de transición (`arte-{id}`) entre lista y detalle |

**Reglas:** todo respeta `prefers-reduced-motion` (sin pantalla de carga, sin 3D en movimiento, cintas quietas, pasos siempre visibles). El contenido está en el HTML aunque falle JavaScript o WebGL; sin WebGL se muestra un dibujo 2D del churro. El único efecto con rebote es `--ease-pop`, usado en los stickers a propósito.

## Qué se evitó

Fondo crema con serif y terracota, tarjetas iguales como estructura, etiquetas en mayúsculas sobre los títulos, gradientes en texto, emojis como íconos, sombras duras desplazadas.

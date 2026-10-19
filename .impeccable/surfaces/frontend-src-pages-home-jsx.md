---
version: 1
slug: "frontend-src-pages-home-jsx"
primary_target: "frontend/src/pages/Home.jsx"
related_targets: []
---

# Surface brief: Home (landing con pedido)

## Scope and visitor mode
Persuade. Ruta `/` del frontend de Churroberto: la puerta de entrada que muestra el churro, el menú real desde la API y lleva al pedido. Las demás pantallas (menú, detalle, carrito, cuenta, admin) heredan el mismo mundo visual con menos espectáculo.

## Audience, job, action, proof, constraints
- Audiencia: vecinos de Villa Urquiza que quieren churros en casa o para retirar, desde el celular.
- Trabajo: entender que acá el churro se hace a la vista y con relleno, y pedir una docena en pocos pasos.
- Acción primaria: "Pedir una docena", visible en la primera pantalla.
- Prueba disponible: dirección, horarios, que se hacen a la vista con relleno de dulce de leche o chocolate, tres reseñas públicas. Sin fotos, precios ni teléfono reales: no se inventan; el menú es de ejemplo y se avisa en el pie.
- Restricciones: React + Vite, datos desde la API, accesibilidad básica, `prefers-reduced-motion`, contraste AA, mobile primero, el efecto 3D no puede bloquear el contenido.

## Pinned by the user
Juguetón y moderno, nivel Awwwards, muchas animaciones y efectos de scroll, churro 3D que rota al scrollear (combinado según la sección). No debe parecer hecho por una IA. Se descarta el "plano de patente".

## Chosen direction and memorable moment
Un pliego de stickers de kiosco. Momento memorable: el churro 3D es el sticker principal, con borde troquelado blanco, que rueda y gira mientras bajás, se frena en "Cómo se hace" y se abre en corte para mostrar el relleno.

## Direction contract
THESIS: La churrería como una hoja de calcomanías de kiosco: colores planos, bordes troquelados blancos y letras gordas como masa recién salida de la manga. El churro 3D es el sticker que se despega y gira al scrollear. Rechaza la lámina técnica, el crema con terracota y las filas de tarjetas iguales.
OWN-WORLD: Campos de color plano a sección: celeste #5BC0F8, manteca #FFD84A, frutilla #FF7DB5 y chocolate #3A1A10; tinta cacao #2B120B y azúcar blanca; el churro en caramelo dorado. Bagel Fat One para títulos y Hanken Grotesk para texto. Stickers con borde blanco troquelado, inclinación leve y sombra suave; bordes de sección festoneados como un toldo; sellos circulares que giran con el scroll.
STORY: El visitante ve un churro enorme y simpático, entiende que se hace a la vista y con relleno, sigue el proceso mientras el churro se abre, confía por las reseñas y el local, y pide una docena.
FIRST VIEWPORT: Campo celeste. A la izquierda el titular en tres líneas gordas ("Churros, hechos, a la vista") y el botón pastilla "Pedir una docena" con "Ver el menú"; a la derecha el churro 3D grande con borde blanco rodando, un sello circular girando y dos stickers sueltos; abajo a la izquierda una pastilla "Abierto ahora".
FORM: Mundo fijado por el usuario con sus palabras, sin sorteo. seed: none (user-pinned direction)
FINISH: unreviewed and undocumented is unfinished; this build ends with the finish review, the verdict, DESIGN.md, and every shipping raster carrying its provenance

## Unresolved decisions
- Si el churro lleva cara (mascota) o queda como objeto.
- Qué datos reales aporta el dueño (menú, precios, teléfono, fotos).
- Teléfono/WhatsApp para el botón de contacto.

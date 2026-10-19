---
version: 1
slug: "frontend-src-pages-home-jsx"
primary_target: "frontend/src/pages/Home.jsx"
related_targets: []
---

# Surface brief: Home (landing con pedido)

## Scope and visitor mode
Persuade. Ruta `/` del frontend de Churroberto. Es la puerta de entrada: muestra el churro, el menú real desde la API y lleva al pedido. Las pantallas de catálogo, carrito, login y admin heredan el mismo mundo visual.

## Audience, job, action, proof, constraints
- Audiencia: vecinos de Villa Urquiza que quieren churros en casa (envío) o retirar en el local, desde el celular.
- Trabajo: entender qué hace distinto a Churroberto y pedir una docena en pocos pasos.
- Acción primaria: "Pedir una docena", visible en la primera pantalla y que lleva al catálogo/carrito.
- Prueba disponible: dirección, horarios, que se hacen a la vista y con relleno de dulce de leche o chocolate, tres reseñas públicas. No hay fotos, precios ni teléfono: no se inventan. Todo menú y precio es de ejemplo y se rotula como tal.
- Restricciones: React + Vite, datos desde la API (nada de negocio escrito en componentes), accesibilidad básica, `prefers-reduced-motion`, contraste AA, mobile primero.

## Chosen direction and memorable moment
Plano de patente. Momento memorable: el churro nace como línea y se rellena. Al scrollear, el contorno dibujado se transforma en el churro 3D que gira y muestra el corte con el relleno.

## Direction contract
THESIS: El churro presentado como una invención patentada: una lámina técnica que se dibuja y se vuelve objeto. Rechaza el hero genérico de churrería (foto, titular cálido y botón) y la lámina técnica fría (azul de plano, mono pequeño en mayúsculas).
OWN-WORLD: Toda la superficie es una lámina color fritura (#E98A1C) con tinta marrón aceite (#2A150C), azúcar (#FFF3DC) para resaltes y canela (#8B4A21) para sombreados. Línea de estilógrafo con trazo vivo, cotas, flechas de llamada, sellos de patente, cajetín con título. Tipografía técnica con carácter (no de la lista de defectos). Foco, cursor, progreso y avisos se dibujan como instrumentos del plano.
STORY: El visitante entiende en segundos que acá el churro se hace a la vista y con relleno, ve de qué está hecho en el corte, cree en el oficio por el detalle técnico y pide una docena.
FIRST VIEWPORT: Lámina completa. A la izquierda y centro, el churro en axonometría de línea (se dibuja con trazo animado) con cotas y el corte en estrella; a la derecha el cajetín "Churroberto N.° 1" con el nombre, las horas de apertura y el sello "Pedir una docena" como acción principal. El churro 3D toma el lugar del dibujo al primer scroll.
FORM: Plano de patente, candidato 7 de mi lista de 7, seed:4e3f71a0bd3d2644. Bloques adoptados de otros mundos: un solo reloj de scroll para CSS, GSAP y Three; compromiso total con el ambiente (cursor, foco, avisos dibujados); menú legible en celular con precio grande.
FINISH: unreviewed and undocumented is unfinished; this build ends with the finish review, the verdict, DESIGN.md, and every shipping raster carrying its provenance

## Unresolved decisions
- Tipografías exactas y escala.
- Si el cursor propio se activa solo con puntero fino.
- Mapa numerado del menú: cuántas fichas por fila en celular.
- Qué datos reales aporta el dueño (menú, precios, teléfono, fotos).

# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Stack

Fijado por la consigna de la cursada, no por preferencia de diseño: frontend React (Vite, JavaScript) en `frontend/`, API Express con patrón MVC en `backend/`, datos en memoria (arrays). Para el efecto 3D se suma Three.js (React Three Fiber). Deploy objetivo: frontend en Vercel y API en un servidor persistente; el proveedor de la API sigue sin elegir.

## Users

Vecinos de Villa Urquiza / Villa Pueyrredón (CABA) y alrededores que quieren que los churros les lleguen a casa: miran el menú desde el celular, arman el pedido, ponen su dirección y eligen cómo pagar al recibir. También pueden optar por retirar en el local. Hay una segunda audiencia interna: quien atiende el local y administra productos y pedidos desde un panel con login.

## Product Purpose

Sitio y sistema de pedidos de la Churrería Churroberto. Que el cliente vea el menú real del local, pida con envío o retiro y siga el estado de su pedido; que el local gestione productos, categorías y pedidos. Es además un proyecto académico de tres entregas (dominio, API MVC, frontend), por lo que cumplir la consigna es parte del éxito.

## Positioning

Es una churrería de barrio que hace los churros a la vista, de forma artesanal, con relleno de dulce de leche o chocolate. Una cadena no puede copiar eso: el churro recién hecho, el dueño en el mostrador y un local decorado como museo con objetos de los años 50 y 60 (según descripciones públicas del local, a confirmar con el dueño).

## Operating Context

Local en José Pascual Tamborini 6186, Villa Urquiza / Villa Pueyrredón, Buenos Aires (coordenadas -34.572705, -58.5038684). Abre de martes a domingo de 8 a 12 y de 15:30 a 19; los lunes cierra. Hoy se encuentra también en Rappi. El pedido se paga al recibir; no hay pasarela de pago real.

## Capabilities and Constraints

- Dominio ya entregado (Entrega 1): Usuario, Categoria, Producto, Carrito, ItemCarrito, Pedido, ItemPedido. Se respeta y se extiende (rol de administrador y datos del local).
- Pedido con retiro en el local (sin dirección) o envío a domicilio (dirección obligatoria); `metodoPago` es una etiqueta (efectivo, transferencia, Mercado Pago).
- Registro y login de clientes; login de administrador con rol.
- Respuestas de la API con formato `{ success, data | message }`, mensajes centralizados y errores con `AppError`.
- Frontend: servicios centralizados, componentes reutilizables, un único sistema de notificaciones, confirmación antes de borrar y accesibilidad básica.
- Sin decidir: zona de reparto, costo de envío, horario de entrega, stock real, número de WhatsApp.

## Brand Commitments

El nombre es "Churroberto" (Churrería Churroberto). Pedido explícito del usuario: estilo moderno cálido con mucha animación impactante al estilo de las webs premiadas en Awwwards, y un churro 3D que rota según la sección mientras se hace scroll. El resto de la identidad (logo, voz, colores) no existe todavía y se define en el diseño.

## Evidence on Hand

Verificable en listados públicos (Rappi, Foursquare, near-place): dirección, coordenadas, horarios, el hecho de que hacen churros a la vista, el relleno de dulce de leche o chocolate, la venta de facturas y tres reseñas de clientes que los llaman "los mejores del barrio".

**No hay y no se debe inventar:** menú real, precios, fotos del local o de los productos, teléfono, WhatsApp, Instagram, testimonios con nombre. Todo menú y precio del sistema es de ejemplo y debe estar marcado como tal hasta que el dueño lo reemplace.

## Product Principles

1. El producto es el churro: la primera pantalla enseña un churro, no una promesa genérica.
2. Pedir tiene que ser más fácil que abrir Rappi: pocos pasos, claro desde el celular.
3. La verdad primero: nada de datos inventados presentados como reales (precios, reseñas, contacto).
4. Lo artesanal y de barrio se nota en la voz y los detalles, no en una estética de cadena.
5. Mucho movimiento, pero nunca a costa de leer, pedir o usar el teclado.

## Accessibility & Inclusion

La consigna exige accesibilidad básica: HTML semántico, `label` asociado a cada `input`, botones semánticos, textos alternativos y navegación clara. Se suma contraste AA y respeto de `prefers-reduced-motion`. Texto y mensajes en español rioplatense.

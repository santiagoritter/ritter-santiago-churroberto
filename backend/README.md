# Backend de Churroberto

API REST con Express 5, patrón MVC y persistencia temporal en arrays.

## Arquitectura

Cada capa tiene una única responsabilidad y solo habla con la siguiente.

```
routes → controllers → services → repositories → models
```

| Carpeta (`src/`) | Responsabilidad |
|---|---|
| `routes` | Asocia cada URL con su controller y los middlewares que necesita. |
| `controllers` | Capa HTTP: lee la request, llama al service y responde. No tiene reglas de negocio. |
| `services` | Reglas de negocio (stock, estados del pedido, permisos de dato). Lanza `AppError`. |
| `repositories` | Acceso a los datos. Cada uno guarda sus registros en un array en memoria. |
| `models` | Clases del dominio: solo constructor y atributos. |
| `middlewares` | Autenticación y roles, validación, límite de intentos, 404 y manejo central de errores. |
| `responses` | `ApiResponse`: único lugar que arma el formato de las respuestas. |
| `exceptions` | `AppError` y sus subclases (`BadRequestError`, `NotFoundError`, etc.). |
| `enums` | `Messages` (todos los mensajes), `Roles`, `EstadoPedido`, `MetodoPago`, `TipoEntrega`. |
| `utils` | Configuración, validadores, JWT, contraseñas y mapeos. |

## Formato de las respuestas

```json
{ "success": true, "data": { } }
{ "success": false, "message": "El producto no existe." }
```

Todo error pasa por `middlewares/errorHandler.js`. Los errores esperados son `AppError` con su código HTTP; cualquier otro error devuelve 500 con un mensaje genérico y no filtra detalles.

## Endpoints

La columna Acceso indica quién puede usarlo: público, cliente con sesión o administrador.

| Método | Ruta | Acceso | Descripción |
|---|---|---|---|
| GET | `/health` | Público | Estado de la API |
| POST | `/auth/registro` | Público | Crea una cuenta de cliente y devuelve el token |
| POST | `/auth/login` | Público | Inicia sesión y devuelve el token |
| GET | `/auth/perfil` | Sesión | Datos del usuario actual |
| GET | `/productos` | Público | Lista productos (`?categoriaId=`) |
| GET | `/productos/:id` | Público | Obtiene un producto |
| POST | `/productos` | Admin | Crea un producto |
| PUT | `/productos/:id` | Admin | Modifica un producto |
| DELETE | `/productos/:id` | Admin | Elimina un producto |
| GET | `/categorias`, `/categorias/:id` | Público | Lista u obtiene categorías |
| POST, PUT, DELETE | `/categorias`, `/categorias/:id` | Admin | Alta, modificación y baja |
| GET | `/carrito` | Sesión | Carrito del usuario con total |
| POST | `/carrito/items` | Sesión | Agrega un producto (`productoId`, `cantidad`) |
| PUT, DELETE | `/carrito/items/:itemId` | Sesión | Cambia la cantidad o quita un ítem |
| DELETE | `/carrito` | Sesión | Vacía el carrito |
| POST | `/pedidos` | Sesión | Confirma el carrito (`tipoEntrega`, `metodoPago`, `direccionEntrega`) |
| GET | `/pedidos/mios` | Sesión | Pedidos del usuario |
| GET | `/pedidos` | Admin | Todos los pedidos |
| GET | `/pedidos/:id` | Sesión | Un pedido propio (el admin ve cualquiera) |
| PATCH | `/pedidos/:id/cancelar` | Sesión | Cancela un pedido propio pendiente |
| PATCH | `/pedidos/:id/estado` | Admin | Cambia el estado (`estado`) |
| GET | `/local` | Público | Datos del local y horarios |
| GET | `/resenas` | Público | Reseñas de clientes |

Las rutas protegidas esperan el encabezado `Authorization: Bearer <token>`.

## Reglas de negocio

- Un producto no puede repetir nombre ni apuntar a una categoría que no existe.
- Una categoría con productos no se puede eliminar.
- Confirmar un pedido valida todo el stock antes de descontar. Cancelarlo devuelve el stock.
- Estados del pedido: `PENDIENTE → EN_PREPARACION → LISTO → ENTREGADO`. Los pedidos con envío pueden pasar por `EN_CAMINO`. Se cancela hasta `EN_PREPARACION`.
- El total de un pedido se calcula siempre en el servidor con los precios vigentes.
- Un cliente no puede ver los pedidos de otro: recibe 404, igual que si no existiera.
- El inicio de sesión responde igual ante un email inexistente y una contraseña incorrecta.

## Variables de entorno

Ver `.env.example`. En producción `JWT_SECRET` y `ADMIN_PASSWORD` son obligatorias.

# Modelo del dominio - Churros Churroberto

Churrería de barrio (José Pascual Tamborini 6186, Buenos Aires) con venta online.

Las entidades se infieren a partir de las páginas del wireframe de baja fidelidad:

| Página del wireframe        | Entidades que aporta                     |
|-----------------------------|------------------------------------------|
| Login / Registro            | Usuario                                  |
| Catálogo de Productos       | Categoria, Producto                      |
| Detalle de Producto         | Producto (con su Categoria)              |
| Carrito de Compras          | Carrito, ItemCarrito, Pedido, ItemPedido |
| Inicio / Contacto           | (navegación, no generan entidades)       |

## Entidades principales

- **Usuario**: cliente que se registra e inicia sesión para comprar.
- **Categoria**: agrupación de productos dentro del catálogo (ej: Churros, Rellenos, Bebidas).
- **Producto**: cada ítem vendible, con su categoría, precio, descripción, imagen y stock.
- **Carrito**: carrito de compras activo de un usuario.
- **ItemCarrito**: línea del carrito (un producto y su cantidad).
- **Pedido**: compra confirmada por el usuario a partir del carrito.
- **ItemPedido**: línea del pedido (producto, cantidad y precio al momento de la compra).

## Diagrama de clases (Mermaid)

```mermaid
classDiagram
    class Usuario {
        +int id
        +string nombre
        +string apellido
        +string email
        +string telefono
        +string contrasena
        +string direccion
        +Date fechaRegistro
        +registrar()
        +iniciarSesion()
        +actualizarPerfil()
    }

    class Categoria {
        +int id
        +string nombre
        +string descripcion
        +listarProductos()
    }

    class Producto {
        +int id
        +string nombre
        +string descripcion
        +float precio
        +string imagen
        +int stock
        +int categoriaId
        +actualizarStock(cantidad)
        +cambiarPrecio(nuevoPrecio)
    }

    class Carrito {
        +int id
        +int usuarioId
        +Date fechaCreacion
        +ItemCarrito[] items
        +agregarItem(producto, cantidad)
        +quitarItem(itemCarrito)
        +vaciar()
        +calcularTotal()
    }

    class ItemCarrito {
        +int id
        +int carritoId
        +int productoId
        +int cantidad
        +float precioUnitario
        +calcularSubtotal()
    }

    class Pedido {
        +int id
        +int usuarioId
        +Date fecha
        +string estado
        +float total
        +string direccionEntrega
        +string metodoPago
        +ItemPedido[] items
        +confirmar()
        +cancelar()
        +calcularTotal()
    }

    class ItemPedido {
        +int id
        +int pedidoId
        +int productoId
        +int cantidad
        +float precioUnitario
        +float subtotal
        +calcularSubtotal()
    }

    Usuario "1" --> "1" Carrito : posee
    Usuario "1" --> "*" Pedido : realiza
    Categoria "1" --> "*" Producto : agrupa
    Carrito "1" *-- "*" ItemCarrito : contiene
    ItemCarrito "*" --> "1" Producto : referencia
    Pedido "1" *-- "*" ItemPedido : contiene
    ItemPedido "*" --> "1" Producto : referencia
```

## Relaciones (resumen)

- Un **Usuario** posee un **Carrito** y realiza muchos **Pedidos**.
- Una **Categoria** agrupa muchos **Productos**; cada Producto pertenece a una Categoria.
- Un **Carrito** contiene muchos **ItemCarrito** (composición: si se elimina el carrito, se eliminan sus ítems).
- Un **Pedido** contiene muchos **ItemPedido** (composición).
- Cada **ItemCarrito** y cada **ItemPedido** referencian un **Producto**.

> Nota: los métodos listados corresponden al diseño del dominio. En la Entrega 1 las clases
> JavaScript de `Backend/src/models/` solo implementan el constructor y los atributos, sin lógica.

import Carrito from "../models/Carrito.js";
import ItemCarrito from "../models/ItemCarrito.js";
import { Messages } from "../enums/Messages.js";
import { ConflictError, NotFoundError } from "../exceptions/AppError.js";
import CarritoRepository from "../repositories/CarritoRepository.js";
import ProductoRepository from "../repositories/ProductoRepository.js";

class CarritoService {
    obtener(usuarioId) {
        return this.#armarVista(this.#carritoDe(usuarioId));
    }

    agregarItem(usuarioId, { productoId, cantidad }) {
        const carrito = this.#carritoDe(usuarioId);
        const producto = this.#exigirProducto(productoId);
        const existente = carrito.items.find((item) => item.productoId === productoId);
        const cantidadTotal = (existente?.cantidad ?? 0) + cantidad;
        this.#exigirStock(producto, cantidadTotal);

        if (existente) {
            existente.cantidad = cantidadTotal;
            existente.precioUnitario = producto.precio;
        } else {
            const item = new ItemCarrito(
                CarritoRepository.nextItemId(),
                carrito.id,
                productoId,
                cantidad,
                producto.precio
            );
            carrito.items.push(item);
        }
        return this.#armarVista(carrito);
    }

    actualizarItem(usuarioId, itemId, { cantidad }) {
        const carrito = this.#carritoDe(usuarioId);
        const item = this.#exigirItem(carrito, itemId);
        const producto = this.#exigirProducto(item.productoId);
        this.#exigirStock(producto, cantidad);
        item.cantidad = cantidad;
        item.precioUnitario = producto.precio;
        return this.#armarVista(carrito);
    }

    quitarItem(usuarioId, itemId) {
        const carrito = this.#carritoDe(usuarioId);
        const item = this.#exigirItem(carrito, itemId);
        carrito.items = carrito.items.filter((existente) => existente.id !== item.id);
        return this.#armarVista(carrito);
    }

    vaciar(usuarioId) {
        const carrito = this.#carritoDe(usuarioId);
        carrito.items = [];
        return this.#armarVista(carrito);
    }

    #carritoDe(usuarioId) {
        const carrito =
            CarritoRepository.findByUsuarioId(usuarioId) ??
            CarritoRepository.save(new Carrito(null, usuarioId, new Date().toISOString(), []));
        // Si un producto fue eliminado del menú, sale también de los carritos.
        carrito.items = carrito.items.filter((item) => ProductoRepository.findById(item.productoId));
        return carrito;
    }

    #exigirProducto(productoId) {
        const producto = ProductoRepository.findById(productoId);
        if (!producto) {
            throw new NotFoundError(Messages.PRODUCT_NOT_FOUND);
        }
        return producto;
    }

    #exigirItem(carrito, itemId) {
        const item = carrito.items.find((existente) => existente.id === itemId);
        if (!item) {
            throw new NotFoundError(Messages.CART_ITEM_NOT_FOUND);
        }
        return item;
    }

    #exigirStock(producto, cantidad) {
        if (cantidad > producto.stock) {
            throw new ConflictError(Messages.PRODUCT_OUT_OF_STOCK);
        }
    }

    #armarVista(carrito) {
        const items = carrito.items.map((item) => ({
            id: item.id,
            productoId: item.productoId,
            nombre: ProductoRepository.findById(item.productoId).nombre,
            cantidad: item.cantidad,
            precioUnitario: item.precioUnitario,
            subtotal: item.cantidad * item.precioUnitario
        }));
        const total = items.reduce((suma, item) => suma + item.subtotal, 0);
        return { id: carrito.id, usuarioId: carrito.usuarioId, fechaCreacion: carrito.fechaCreacion, items, total };
    }
}

export default new CarritoService();

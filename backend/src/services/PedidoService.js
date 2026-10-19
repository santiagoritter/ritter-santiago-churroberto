import Pedido from "../models/Pedido.js";
import ItemPedido from "../models/ItemPedido.js";
import { Messages } from "../enums/Messages.js";
import { EstadoPedido } from "../enums/EstadoPedido.js";
import { Roles } from "../enums/Roles.js";
import { TipoEntrega } from "../enums/TipoEntrega.js";
import { BadRequestError, ConflictError, NotFoundError } from "../exceptions/AppError.js";
import PedidoRepository from "../repositories/PedidoRepository.js";
import CarritoRepository from "../repositories/CarritoRepository.js";
import ProductoRepository from "../repositories/ProductoRepository.js";

const TRANSICIONES = Object.freeze({
    [EstadoPedido.PENDIENTE]: [EstadoPedido.EN_PREPARACION, EstadoPedido.CANCELADO],
    [EstadoPedido.EN_PREPARACION]: [EstadoPedido.LISTO, EstadoPedido.CANCELADO],
    [EstadoPedido.LISTO]: [EstadoPedido.EN_CAMINO, EstadoPedido.ENTREGADO],
    [EstadoPedido.EN_CAMINO]: [EstadoPedido.ENTREGADO],
    [EstadoPedido.ENTREGADO]: [],
    [EstadoPedido.CANCELADO]: []
});

class PedidoService {
    crear(usuarioId, datos) {
        const carrito = CarritoRepository.findByUsuarioId(usuarioId);
        if (!carrito || carrito.items.length === 0) {
            throw new BadRequestError(Messages.CART_EMPTY);
        }

        // Primero se valida todo; el stock solo se descuenta si cada producto alcanza.
        const lineas = carrito.items.map((item) => {
            const producto = ProductoRepository.findById(item.productoId);
            if (!producto) {
                throw new NotFoundError(Messages.PRODUCT_NOT_FOUND);
            }
            if (producto.stock < item.cantidad) {
                throw new ConflictError(Messages.PRODUCT_OUT_OF_STOCK);
            }
            return { producto, cantidad: item.cantidad };
        });

        const pedido = PedidoRepository.save(
            new Pedido(
                null,
                usuarioId,
                new Date().toISOString(),
                EstadoPedido.PENDIENTE,
                0,
                datos.direccionEntrega,
                datos.metodoPago,
                [],
                datos.tipoEntrega
            )
        );
        pedido.items = lineas.map(({ producto, cantidad }) => {
            producto.stock -= cantidad;
            return new ItemPedido(
                PedidoRepository.nextItemId(),
                pedido.id,
                producto.id,
                cantidad,
                producto.precio,
                producto.precio * cantidad,
                producto.nombre
            );
        });
        pedido.total = pedido.items.reduce((suma, item) => suma + item.subtotal, 0);
        carrito.items = [];
        return pedido;
    }

    listarDe(usuarioId) {
        return PedidoRepository.findByUsuarioId(usuarioId).reverse();
    }

    listarTodos() {
        return PedidoRepository.findAll().reverse();
    }

    obtener(id, usuario) {
        const pedido = PedidoRepository.findById(id);
        // Un cliente no puede saber si el pedido de otra persona existe.
        if (!pedido || (usuario.rol !== Roles.ADMIN && pedido.usuarioId !== usuario.id)) {
            throw new NotFoundError(Messages.ORDER_NOT_FOUND);
        }
        return pedido;
    }

    cambiarEstado(id, estado) {
        const pedido = this.#exigirPedido(id);
        const permitido =
            TRANSICIONES[pedido.estado].includes(estado) &&
            !(estado === EstadoPedido.EN_CAMINO && pedido.tipoEntrega !== TipoEntrega.ENVIO);
        if (!permitido) {
            throw new ConflictError(Messages.ORDER_INVALID_TRANSITION);
        }
        if (estado === EstadoPedido.CANCELADO) {
            this.#devolverStock(pedido);
        }
        pedido.estado = estado;
        return pedido;
    }

    cancelar(id, usuario) {
        const pedido = this.obtener(id, usuario);
        if (pedido.estado !== EstadoPedido.PENDIENTE) {
            throw new ConflictError(Messages.ORDER_CANNOT_CANCEL);
        }
        return this.cambiarEstado(id, EstadoPedido.CANCELADO);
    }

    #exigirPedido(id) {
        const pedido = PedidoRepository.findById(id);
        if (!pedido) {
            throw new NotFoundError(Messages.ORDER_NOT_FOUND);
        }
        return pedido;
    }

    #devolverStock(pedido) {
        pedido.items.forEach((item) => {
            const producto = ProductoRepository.findById(item.productoId);
            if (producto) {
                producto.stock += item.cantidad;
            }
        });
    }
}

export default new PedidoService();

import { Messages } from "../enums/Messages.js";
import { EstadoPedido } from "../enums/EstadoPedido.js";
import { MetodoPago } from "../enums/MetodoPago.js";
import { TipoEntrega } from "../enums/TipoEntrega.js";
import { BadRequestError } from "../exceptions/AppError.js";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const TELEFONO_REGEX = /^[0-9+()\-\s]{6,20}$/;
const CONTRASENA_MIN = 8;

const exigirObjeto = (body) => {
    if (body === null || typeof body !== "object" || Array.isArray(body)) {
        throw new BadRequestError(Messages.INVALID_DATA);
    }
    return body;
};

const texto = (valor) => (typeof valor === "string" ? valor.trim() : "");

const exigirTexto = (valor, mensaje) => {
    const limpio = texto(valor);
    if (!limpio) {
        throw new BadRequestError(mensaje);
    }
    return limpio;
};

const aNumero = (valor) => {
    if (typeof valor === "number") {
        return valor;
    }
    if (typeof valor === "string" && valor.trim() !== "") {
        return Number(valor);
    }
    return NaN;
};

const exigirEntero = (valor, minimo, mensaje) => {
    const numero = aNumero(valor);
    if (!Number.isInteger(numero) || numero < minimo) {
        throw new BadRequestError(mensaje);
    }
    return numero;
};

const exigirEnum = (valor, enumerado, mensaje) => {
    if (!Object.values(enumerado).includes(valor)) {
        throw new BadRequestError(mensaje);
    }
    return valor;
};

export const parseId = (valor) => {
    const id = aNumero(valor);
    if (!Number.isInteger(id) || id <= 0) {
        throw new BadRequestError(Messages.INVALID_ID);
    }
    return id;
};

export const validarProducto = (body) => {
    const datos = exigirObjeto(body);
    const nombre = exigirTexto(datos.nombre, Messages.NAME_REQUIRED);
    const precio = aNumero(datos.precio);
    if (!Number.isFinite(precio) || precio <= 0) {
        throw new BadRequestError(Messages.PRICE_INVALID);
    }
    return {
        nombre,
        descripcion: texto(datos.descripcion),
        precio,
        imagen: texto(datos.imagen) || null,
        stock: datos.stock === undefined ? 0 : exigirEntero(datos.stock, 0, Messages.STOCK_INVALID),
        categoriaId: exigirEntero(datos.categoriaId, 1, Messages.CATEGORY_REQUIRED)
    };
};

export const validarCategoria = (body) => {
    const datos = exigirObjeto(body);
    return {
        nombre: exigirTexto(datos.nombre, Messages.NAME_REQUIRED),
        descripcion: texto(datos.descripcion)
    };
};

export const validarRegistro = (body) => {
    const datos = exigirObjeto(body);
    const email = texto(datos.email).toLowerCase();
    const telefono = texto(datos.telefono);
    if (!EMAIL_REGEX.test(email)) {
        throw new BadRequestError(Messages.EMAIL_INVALID);
    }
    if (!TELEFONO_REGEX.test(telefono)) {
        throw new BadRequestError(Messages.PHONE_INVALID);
    }
    if (typeof datos.contrasena !== "string" || datos.contrasena.length < CONTRASENA_MIN) {
        throw new BadRequestError(Messages.PASSWORD_INVALID);
    }
    return {
        nombre: exigirTexto(datos.nombre, Messages.NAME_REQUIRED),
        apellido: exigirTexto(datos.apellido, Messages.LAST_NAME_REQUIRED),
        email,
        telefono,
        contrasena: datos.contrasena,
        direccion: texto(datos.direccion) || null
    };
};

export const validarLogin = (body) => {
    const datos = exigirObjeto(body);
    const email = texto(datos.email).toLowerCase();
    if (!email || typeof datos.contrasena !== "string" || datos.contrasena === "") {
        throw new BadRequestError(Messages.INVALID_DATA);
    }
    return { email, contrasena: datos.contrasena };
};

export const validarItemCarrito = (body) => {
    const datos = exigirObjeto(body);
    return {
        productoId: exigirEntero(datos.productoId, 1, Messages.INVALID_ID),
        cantidad: exigirEntero(datos.cantidad, 1, Messages.QUANTITY_INVALID)
    };
};

export const validarCantidad = (body) => {
    const datos = exigirObjeto(body);
    return { cantidad: exigirEntero(datos.cantidad, 1, Messages.QUANTITY_INVALID) };
};

export const validarPedido = (body) => {
    const datos = exigirObjeto(body);
    const tipoEntrega = exigirEnum(datos.tipoEntrega, TipoEntrega, Messages.DELIVERY_TYPE_INVALID);
    const metodoPago = exigirEnum(datos.metodoPago, MetodoPago, Messages.PAYMENT_METHOD_INVALID);
    const direccionEntrega = texto(datos.direccionEntrega);
    if (tipoEntrega === TipoEntrega.ENVIO && !direccionEntrega) {
        throw new BadRequestError(Messages.ADDRESS_REQUIRED);
    }
    return {
        tipoEntrega,
        metodoPago,
        direccionEntrega: tipoEntrega === TipoEntrega.ENVIO ? direccionEntrega : null
    };
};

export const validarEstado = (body) => {
    const datos = exigirObjeto(body);
    return { estado: exigirEnum(datos.estado, EstadoPedido, Messages.STATUS_INVALID) };
};

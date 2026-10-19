// Cada validador devuelve un objeto { campo: "mensaje" }. Si está vacío, el formulario es válido.
const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const TELEFONO = /^[0-9+()\-\s]{6,20}$/;

export const MENSAJES = Object.freeze({
    obligatorio: "Completá este campo.",
    email: "Escribí un email válido, por ejemplo nombre@correo.com.",
    telefono: "Escribí un teléfono válido, solo números, espacios, + o guiones.",
    contrasena: "La contraseña necesita al menos 8 caracteres.",
    precio: "Escribí un precio mayor a 0.",
    stock: "Escribí un stock entero, de 0 en adelante.",
    categoria: "Elegí una categoría.",
    direccion: "Escribí la dirección donde te lo llevamos."
});

const vacio = (valor) => String(valor ?? "").trim() === "";

export const validarIngreso = ({ email, contrasena }) => {
    const errores = {};
    if (!EMAIL.test(String(email).trim())) errores.email = MENSAJES.email;
    if (vacio(contrasena)) errores.contrasena = MENSAJES.obligatorio;
    return errores;
};

export const validarRegistro = ({ nombre, apellido, email, telefono, contrasena }) => {
    const errores = {};
    if (vacio(nombre)) errores.nombre = MENSAJES.obligatorio;
    if (vacio(apellido)) errores.apellido = MENSAJES.obligatorio;
    if (!EMAIL.test(String(email).trim())) errores.email = MENSAJES.email;
    if (!TELEFONO.test(String(telefono).trim())) errores.telefono = MENSAJES.telefono;
    if (String(contrasena).length < 8) errores.contrasena = MENSAJES.contrasena;
    return errores;
};

export const validarProducto = ({ nombre, precio, stock, categoriaId }) => {
    const errores = {};
    if (vacio(nombre)) errores.nombre = MENSAJES.obligatorio;
    if (!(Number(precio) > 0)) errores.precio = MENSAJES.precio;
    if (vacio(stock) || !Number.isInteger(Number(stock)) || Number(stock) < 0) errores.stock = MENSAJES.stock;
    if (vacio(categoriaId)) errores.categoriaId = MENSAJES.categoria;
    return errores;
};

export const validarPedido = ({ tipoEntrega, direccionEntrega }) => {
    const errores = {};
    if (tipoEntrega === "ENVIO" && vacio(direccionEntrega)) errores.direccionEntrega = MENSAJES.direccion;
    return errores;
};

export const hayErrores = (errores) => Object.keys(errores).length > 0;

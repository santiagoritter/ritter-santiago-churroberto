const formatoPrecio = new Intl.NumberFormat("es-AR", {
    style: "currency",
    currency: "ARS",
    maximumFractionDigits: 0
});

const formatoFecha = new Intl.DateTimeFormat("es-AR", {
    dateStyle: "medium",
    timeStyle: "short",
    timeZone: "America/Argentina/Buenos_Aires"
});

export const formatearPrecio = (valor) => formatoPrecio.format(valor);

export const formatearFecha = (iso) => formatoFecha.format(new Date(iso));

export const ETIQUETAS_ESTADO = Object.freeze({
    PENDIENTE: "Pendiente",
    EN_PREPARACION: "En preparación",
    LISTO: "Listo",
    EN_CAMINO: "En camino",
    ENTREGADO: "Entregado",
    CANCELADO: "Cancelado"
});

export const ETIQUETAS_ENTREGA = Object.freeze({
    RETIRO: "Retiro en el local",
    ENVIO: "Envío a domicilio"
});

export const ETIQUETAS_PAGO = Object.freeze({
    EFECTIVO: "Efectivo",
    TRANSFERENCIA: "Transferencia",
    MERCADO_PAGO: "Mercado Pago"
});

// Tono visual de la insignia de cada estado de pedido.
export const TONO_ESTADO = Object.freeze({
    PENDIENTE: "aviso",
    EN_PREPARACION: "info",
    LISTO: "exito",
    EN_CAMINO: "info",
    ENTREGADO: "exito",
    CANCELADO: "error"
});

export const limitar = (valor, minimo, maximo) => Math.min(maximo, Math.max(minimo, valor));

class Pedido {
    constructor(id, usuarioId, fecha, estado, total, direccionEntrega, metodoPago, items) {
        this.id = id;
        this.usuarioId = usuarioId;
        this.fecha = fecha;
        this.estado = estado;
        this.total = total;
        this.direccionEntrega = direccionEntrega;
        this.metodoPago = metodoPago;
        this.items = items;
    }
}

export default Pedido;

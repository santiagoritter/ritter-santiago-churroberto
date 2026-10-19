class ItemPedido {
    constructor(id, pedidoId, productoId, cantidad, precioUnitario, subtotal, nombreProducto) {
        this.id = id;
        this.pedidoId = pedidoId;
        this.productoId = productoId;
        this.cantidad = cantidad;
        this.precioUnitario = precioUnitario;
        this.subtotal = subtotal;
        this.nombreProducto = nombreProducto;
    }
}

export default ItemPedido;

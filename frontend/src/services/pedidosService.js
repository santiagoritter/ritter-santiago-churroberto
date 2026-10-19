import { http } from "./http";

export const listarMisPedidos = ({ signal } = {}) => http.get("/pedidos/mios", { signal });

export const listarTodosLosPedidos = ({ signal } = {}) => http.get("/pedidos", { signal });

export const obtenerPedido = (id, { signal } = {}) => http.get(`/pedidos/${id}`, { signal });

export const cancelarPedido = (id) => http.patch(`/pedidos/${id}/cancelar`);

export const cambiarEstadoPedido = (id, estado) => http.patch(`/pedidos/${id}/estado`, { estado });

// El carrito que se arma en el sitio vive en el navegador. Para confirmar, se copia al carrito del
// usuario en la API (que es quien valida stock y precios) y recién ahí se crea el pedido.
export const confirmarPedido = async (items, datosEntrega) => {
    await http.delete("/carrito");
    await Promise.all(
        items.map((item) => http.post("/carrito/items", { productoId: item.productoId, cantidad: item.cantidad }))
    );
    return http.post("/pedidos", datosEntrega);
};

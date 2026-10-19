import { http } from "./http";

export const listarProductos = ({ categoriaId, signal } = {}) =>
    http.get(categoriaId ? `/productos?categoriaId=${categoriaId}` : "/productos", { signal });

export const obtenerProducto = (id, { signal } = {}) => http.get(`/productos/${id}`, { signal });

export const crearProducto = (datos) => http.post("/productos", datos);

export const actualizarProducto = (id, datos) => http.put(`/productos/${id}`, datos);

export const eliminarProducto = (id) => http.delete(`/productos/${id}`);

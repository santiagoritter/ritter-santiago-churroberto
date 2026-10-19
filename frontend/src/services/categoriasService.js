import { http } from "./http";

export const listarCategorias = ({ signal } = {}) => http.get("/categorias", { signal });

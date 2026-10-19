import { http } from "./http";

export const listarResenas = ({ signal } = {}) => http.get("/resenas", { signal });

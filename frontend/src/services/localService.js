import { http } from "./http";

export const obtenerLocal = ({ signal } = {}) => http.get("/local", { signal });

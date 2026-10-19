import { http } from "./http";

export const registrarse = (datos) => http.post("/auth/registro", datos, { conSesion: false });

export const iniciarSesion = (datos) => http.post("/auth/login", datos, { conSesion: false });

export const obtenerPerfil = ({ signal } = {}) => http.get("/auth/perfil", { signal });

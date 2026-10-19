import { borrarLocal, guardarLocal, leerLocal } from "../utils/storage";

export const API_URL = (import.meta.env.VITE_API_URL ?? "http://localhost:3000").replace(/\/$/, "");

const CLAVE_TOKEN = "churroberto.token";
const MENSAJE_SIN_CONEXION = "No pudimos conectarnos con el servidor. Revisá tu conexión e intentá de nuevo.";
const MENSAJE_GENERICO = "Algo salió mal. Intentá de nuevo en un momento.";

export class ApiError extends Error {
    constructor(message, status = 0) {
        super(message);
        this.name = "ApiError";
        this.status = status;
    }
}

let alExpirarSesion = () => {};

export const sesion = {
    obtenerToken: () => leerLocal(CLAVE_TOKEN),
    guardarToken: (token) => guardarLocal(CLAVE_TOKEN, token),
    borrarToken: () => borrarLocal(CLAVE_TOKEN),
    // El AuthContext registra qué hacer cuando el servidor rechaza el token.
    alExpirar: (callback) => {
        alExpirarSesion = callback;
    }
};

const pedir = async (ruta, { metodo = "GET", cuerpo, signal, conSesion = true } = {}) => {
    const encabezados = {};
    const token = sesion.obtenerToken();
    if (cuerpo !== undefined) encabezados["Content-Type"] = "application/json";
    if (conSesion && token) encabezados.Authorization = `Bearer ${token}`;

    let respuesta;
    try {
        respuesta = await fetch(`${API_URL}${ruta}`, {
            method: metodo,
            headers: encabezados,
            body: cuerpo === undefined ? undefined : JSON.stringify(cuerpo),
            signal
        });
    } catch (error) {
        if (error.name === "AbortError") throw error;
        throw new ApiError(MENSAJE_SIN_CONEXION);
    }

    let contenido = null;
    try {
        contenido = await respuesta.json();
    } catch {
        // La respuesta no era JSON: se informa con el mensaje genérico.
    }

    if (!respuesta.ok || !contenido?.success) {
        if (respuesta.status === 401 && conSesion && token) alExpirarSesion();
        throw new ApiError(contenido?.message ?? MENSAJE_GENERICO, respuesta.status);
    }
    return contenido.data;
};

export const http = {
    get: (ruta, opciones) => pedir(ruta, opciones),
    post: (ruta, cuerpo, opciones) => pedir(ruta, { ...opciones, metodo: "POST", cuerpo }),
    put: (ruta, cuerpo, opciones) => pedir(ruta, { ...opciones, metodo: "PUT", cuerpo }),
    patch: (ruta, cuerpo, opciones) => pedir(ruta, { ...opciones, metodo: "PATCH", cuerpo }),
    delete: (ruta, opciones) => pedir(ruta, { ...opciones, metodo: "DELETE" })
};

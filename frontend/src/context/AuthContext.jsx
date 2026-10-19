import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import {
    iniciarSesion as iniciarSesionApi,
    obtenerPerfil,
    registrarse as registrarseApi
} from "../services/authService";
import { sesion } from "../services/http";
import { useToast } from "./ToastContext";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
    const toast = useToast();
    const [usuario, setUsuario] = useState(null);
    const [cargando, setCargando] = useState(() => Boolean(sesion.obtenerToken()));

    // Si el servidor rechaza el token, se cierra la sesión y se avisa.
    useEffect(() => {
        sesion.alExpirar(() => {
            sesion.borrarToken();
            setUsuario(null);
            toast.info("Tu sesión venció. Iniciá sesión de nuevo.");
        });
    }, [toast]);

    // Al abrir el sitio con una sesión guardada, se recupera el usuario.
    useEffect(() => {
        if (!sesion.obtenerToken()) return undefined;
        const controlador = new AbortController();
        obtenerPerfil({ signal: controlador.signal })
            .then(setUsuario)
            .catch(() => {})
            .finally(() => {
                if (!controlador.signal.aborted) setCargando(false);
            });
        return () => controlador.abort();
    }, []);

    const abrirSesion = useCallback((respuesta) => {
        sesion.guardarToken(respuesta.token);
        setUsuario(respuesta.usuario);
        return respuesta.usuario;
    }, []);

    const iniciarSesion = useCallback(async (datos) => abrirSesion(await iniciarSesionApi(datos)), [abrirSesion]);

    const registrarse = useCallback(async (datos) => abrirSesion(await registrarseApi(datos)), [abrirSesion]);

    const cerrarSesion = useCallback(() => {
        sesion.borrarToken();
        setUsuario(null);
    }, []);

    const valor = useMemo(
        () => ({
            usuario,
            cargando,
            estaLogueado: Boolean(usuario),
            esAdmin: usuario?.rol === "ADMIN",
            iniciarSesion,
            registrarse,
            cerrarSesion
        }),
        [usuario, cargando, iniciarSesion, registrarse, cerrarSesion]
    );

    return <AuthContext value={valor}>{children}</AuthContext>;
}

export const useAuth = () => {
    const contexto = useContext(AuthContext);
    if (!contexto) throw new Error("useAuth debe usarse dentro de AuthProvider");
    return contexto;
};

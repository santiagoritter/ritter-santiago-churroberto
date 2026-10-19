import { createContext, useCallback, useContext, useMemo, useState } from "react";
import ToastViewport from "../components/feedback/ToastViewport";

const ToastContext = createContext(null);
const MAXIMO_VISIBLES = 4;
const DURACION_SALIDA_MS = 320;
let contador = 0;

// Un único sistema de avisos para toda la app: éxito, error e información.
export function ToastProvider({ children }) {
    const [avisos, setAvisos] = useState([]);

    // Cerrar es en dos tiempos: primero el aviso se marca como "saliendo" (se anima) y recién después se quita.
    const cerrar = useCallback((id) => {
        setAvisos((actuales) => actuales.map((aviso) => (aviso.id === id ? { ...aviso, saliendo: true } : aviso)));
        setTimeout(() => setAvisos((actuales) => actuales.filter((aviso) => aviso.id !== id)), DURACION_SALIDA_MS);
    }, []);

    const mostrar = useCallback((tipo, mensaje, accion) => {
        contador += 1;
        const id = contador;
        setAvisos((actuales) => [...actuales.slice(-(MAXIMO_VISIBLES - 1)), { id, tipo, mensaje, accion }]);
        return id;
    }, []);

    const api = useMemo(
        () => ({
            // `accion` es opcional: { texto, alHacer } agrega un botón al aviso.
            exito: (mensaje, accion) => mostrar("exito", mensaje, accion),
            error: (mensaje) => mostrar("error", mensaje),
            info: (mensaje, accion) => mostrar("info", mensaje, accion),
            cerrar
        }),
        [mostrar, cerrar]
    );

    return (
        <ToastContext value={api}>
            {children}
            <ToastViewport avisos={avisos} alCerrar={cerrar} />
        </ToastContext>
    );
}

export const useToast = () => {
    const contexto = useContext(ToastContext);
    if (!contexto) throw new Error("useToast debe usarse dentro de ToastProvider");
    return contexto;
};

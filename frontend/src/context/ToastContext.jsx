import { createContext, useCallback, useContext, useMemo, useState } from "react";
import ToastViewport from "../components/feedback/ToastViewport";

const ToastContext = createContext(null);
const MAXIMO_VISIBLES = 4;
let contador = 0;

// Un único sistema de avisos para toda la app: éxito, error e información.
export function ToastProvider({ children }) {
    const [avisos, setAvisos] = useState([]);

    const cerrar = useCallback((id) => {
        setAvisos((actuales) => actuales.filter((aviso) => aviso.id !== id));
    }, []);

    const mostrar = useCallback((tipo, mensaje) => {
        contador += 1;
        const id = contador;
        setAvisos((actuales) => [...actuales.slice(-(MAXIMO_VISIBLES - 1)), { id, tipo, mensaje }]);
        return id;
    }, []);

    const api = useMemo(
        () => ({
            exito: (mensaje) => mostrar("exito", mensaje),
            error: (mensaje) => mostrar("error", mensaje),
            info: (mensaje) => mostrar("info", mensaje),
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

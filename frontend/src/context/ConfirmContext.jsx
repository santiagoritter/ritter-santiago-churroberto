import { createContext, useCallback, useContext, useMemo, useRef, useState } from "react";
import ConfirmDialog from "../components/feedback/ConfirmDialog";

const ConfirmContext = createContext(null);

// confirmar({ titulo, mensaje, confirmar }) devuelve una promesa que resuelve true o false.
export function ConfirmProvider({ children }) {
    const [opciones, setOpciones] = useState(null);
    const resolver = useRef(null);

    const confirmar = useCallback(
        (datos) =>
            new Promise((resolve) => {
                resolver.current = resolve;
                setOpciones(datos);
            }),
        []
    );

    const responder = useCallback((valor) => {
        resolver.current?.(valor);
        resolver.current = null;
        setOpciones(null);
    }, []);

    const api = useMemo(() => ({ confirmar }), [confirmar]);

    return (
        <ConfirmContext value={api}>
            {children}
            <ConfirmDialog opciones={opciones} alResponder={responder} />
        </ConfirmContext>
    );
}

export const useConfirm = () => {
    const contexto = useContext(ConfirmContext);
    if (!contexto) throw new Error("useConfirm debe usarse dentro de ConfirmProvider");
    return contexto.confirmar;
};

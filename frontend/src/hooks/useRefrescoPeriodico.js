import { useEffect } from "react";

// Repite una acción cada cierto tiempo mientras la pestaña está a la vista (por ejemplo, ver si cambió un pedido).
export const useRefrescoPeriodico = (alRefrescar, { cadaMs = 20000, activo = true } = {}) => {
    useEffect(() => {
        if (!activo) return undefined;
        const intervalo = setInterval(() => {
            if (document.visibilityState === "visible") alRefrescar();
        }, cadaMs);
        return () => clearInterval(intervalo);
    }, [alRefrescar, cadaMs, activo]);
};

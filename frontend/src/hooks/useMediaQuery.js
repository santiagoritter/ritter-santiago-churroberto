import { useSyncExternalStore } from "react";

export const useMediaQuery = (consulta) =>
    useSyncExternalStore(
        (avisar) => {
            const lista = window.matchMedia(consulta);
            lista.addEventListener("change", avisar);
            return () => lista.removeEventListener("change", avisar);
        },
        () => window.matchMedia(consulta).matches,
        () => false
    );

export const useMenosMovimiento = () => useMediaQuery("(prefers-reduced-motion: reduce)");
export const useEsMovil = () => useMediaQuery("(max-width: 800px)");

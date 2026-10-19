import { useEffect } from "react";
import { ScrollTrigger } from "../utils/smoothScroll";

// Cuando cambia el alto de la página (llegan datos, se cargan fuentes), los puntos de scroll se recalculan.
export const useRefrescarScroll = () => {
    useEffect(() => {
        let temporizador;
        const observador = new ResizeObserver(() => {
            clearTimeout(temporizador);
            temporizador = setTimeout(() => ScrollTrigger.refresh(), 180);
        });
        observador.observe(document.body);
        return () => {
            clearTimeout(temporizador);
            observador.disconnect();
        };
    }, []);
};

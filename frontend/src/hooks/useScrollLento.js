import { useEffect } from "react";
import { frenarScroll, ScrollTrigger, soltarScroll } from "../utils/smoothScroll";

// Mientras la sección ocupa el rango indicado, la rueda va más despacio: `factor` es la fracción de la velocidad normal.
export const useScrollLento = (ref, { inicio, fin, factor = 0.4 }) => {
    useEffect(() => {
        const disparador = ScrollTrigger.create({
            trigger: ref.current,
            start: inicio,
            end: fin,
            onToggle: (self) => (self.isActive ? frenarScroll(factor) : soltarScroll())
        });
        return () => {
            disparador.kill();
            soltarScroll();
        };
    }, [ref, inicio, fin, factor]);
};

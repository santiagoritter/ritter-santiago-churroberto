import { useLayoutEffect, useRef } from "react";
import { prefiereMenosMovimiento } from "../utils/motion";

// Cuando cambia el orden o el filtro de una lista, cada elemento que sigue estando se desliza desde donde estaba
// hasta su lugar nuevo (técnica FLIP). Los elementos necesitan un atributo data-flip con un identificador único.
export const useFlip = (clave) => {
    const contenedor = useRef(null);
    const posiciones = useRef(new Map());

    useLayoutEffect(() => {
        const lista = contenedor.current;
        if (!lista) return;
        const nuevas = new Map();
        lista.querySelectorAll("[data-flip]").forEach((elemento) => {
            const caja = elemento.getBoundingClientRect();
            // Se guarda en coordenadas de la página, no de la ventana, para que el scroll no falsee la comparación.
            nuevas.set(elemento.dataset.flip, {
                x: caja.left + window.scrollX,
                y: caja.top + window.scrollY,
                elemento
            });
        });

        if (!prefiereMenosMovimiento()) {
            nuevas.forEach((ahora, id) => {
                const antes = posiciones.current.get(id);
                if (!antes) return;
                const dx = antes.x - ahora.x;
                const dy = antes.y - ahora.y;
                if (Math.abs(dx) < 1 && Math.abs(dy) < 1) return;
                ahora.elemento.animate(
                    [{ transform: `translate(${dx}px, ${dy}px)` }, { transform: "translate(0, 0)" }],
                    { duration: 600, easing: "cubic-bezier(0.16, 1, 0.3, 1)" }
                );
            });
        }
        posiciones.current = nuevas;
    }, [clave]);

    return contenedor;
};

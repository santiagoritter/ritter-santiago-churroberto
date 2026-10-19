import { useEffect, useRef } from "react";

// Espera a que termine la pantalla de carga antes de animar lo que ya está a la vista.
const cuandoListo = (callback) => {
    if (document.documentElement.dataset.precarga !== "activa") {
        callback();
        return () => {};
    }
    window.addEventListener("precarga:fin", callback, { once: true });
    return () => window.removeEventListener("precarga:fin", callback);
};

// Marca el elemento con .is-in la primera vez que entra en pantalla. La animación vive en el CSS.
export const useRevelar = ({ umbral = 0.2, margen = "0px 0px -8% 0px" } = {}) => {
    const ref = useRef(null);

    useEffect(() => {
        const elemento = ref.current;
        if (!elemento) return undefined;
        let cancelar = () => {};

        const observador = new IntersectionObserver(
            ([entrada]) => {
                if (!entrada.isIntersecting) return;
                observador.disconnect();
                cancelar = cuandoListo(() => elemento.classList.add("is-in"));
            },
            { threshold: umbral, rootMargin: margen }
        );
        observador.observe(elemento);

        return () => {
            observador.disconnect();
            cancelar();
        };
    }, [umbral, margen]);

    return ref;
};

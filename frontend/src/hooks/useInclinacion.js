import { useEffect, useRef } from "react";
import { hayPunteroFino, prefiereMenosMovimiento } from "../utils/motion";

const GRADOS_MAXIMOS = 7;

// La tarjeta se inclina hacia donde está el mouse, como un sticker que se despega de un lado.
export const useInclinacion = () => {
    const ref = useRef(null);

    useEffect(() => {
        const elemento = ref.current;
        if (!elemento || !hayPunteroFino() || prefiereMenosMovimiento()) return undefined;
        let cuadro = 0;

        const mover = (evento) => {
            cancelAnimationFrame(cuadro);
            cuadro = requestAnimationFrame(() => {
                const caja = elemento.getBoundingClientRect();
                const x = (evento.clientX - caja.left) / caja.width - 0.5;
                const y = (evento.clientY - caja.top) / caja.height - 0.5;
                elemento.style.setProperty("--rx", `${(-y * GRADOS_MAXIMOS * 2).toFixed(2)}deg`);
                elemento.style.setProperty("--ry", `${(x * GRADOS_MAXIMOS * 2).toFixed(2)}deg`);
            });
        };
        const soltar = () => {
            cancelAnimationFrame(cuadro);
            elemento.style.setProperty("--rx", "0deg");
            elemento.style.setProperty("--ry", "0deg");
        };

        elemento.addEventListener("pointermove", mover);
        elemento.addEventListener("pointerleave", soltar);
        return () => {
            cancelAnimationFrame(cuadro);
            elemento.removeEventListener("pointermove", mover);
            elemento.removeEventListener("pointerleave", soltar);
        };
    }, []);

    return ref;
};

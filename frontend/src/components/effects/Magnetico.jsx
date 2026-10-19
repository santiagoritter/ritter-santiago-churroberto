import { useEffect, useRef } from "react";
import { hayPunteroFino, prefiereMenosMovimiento } from "../../utils/motion";

// El contenido se acerca un poco al puntero cuando pasa cerca. Solo con mouse y sin "reducir movimiento".
export default function Magnetico({ fuerza = 0.35, children }) {
    const ref = useRef(null);

    useEffect(() => {
        if (!hayPunteroFino() || prefiereMenosMovimiento()) return undefined;
        const elemento = ref.current;

        const mover = (evento) => {
            const caja = elemento.getBoundingClientRect();
            const x = (evento.clientX - (caja.left + caja.width / 2)) * fuerza;
            const y = (evento.clientY - (caja.top + caja.height / 2)) * fuerza;
            elemento.style.transform = `translate(${x}px, ${y}px)`;
        };
        const soltar = () => {
            elemento.style.transform = "";
        };

        elemento.addEventListener("pointermove", mover);
        elemento.addEventListener("pointerleave", soltar);
        return () => {
            elemento.removeEventListener("pointermove", mover);
            elemento.removeEventListener("pointerleave", soltar);
        };
    }, [fuerza]);

    return (
        <span className="magnetico" ref={ref}>
            {children}
        </span>
    );
}

import { useEffect, useState } from "react";

const UMBRAL_MOVIMIENTO = 10;
const DESDE_DONDE_SE_ESCONDE = 320;
const DESDE_DONDE_SE_COMPACTA = 40;

// Dice hacia dónde se está scrolleando: la cabecera se esconde al bajar y reaparece al subir.
export const useDireccionScroll = () => {
    const [estado, setEstado] = useState({ oculta: false, compacta: false });

    useEffect(() => {
        let ultimo = window.scrollY;
        let pendiente = false;

        const medir = () => {
            pendiente = false;
            const y = window.scrollY;
            const diferencia = y - ultimo;
            const compacta = y > DESDE_DONDE_SE_COMPACTA;
            let oculta;

            if (y < DESDE_DONDE_SE_ESCONDE) oculta = false;
            else if (diferencia > UMBRAL_MOVIMIENTO) oculta = true;
            else if (diferencia < -UMBRAL_MOVIMIENTO) oculta = false;

            if (Math.abs(diferencia) > UMBRAL_MOVIMIENTO) ultimo = y;
            setEstado((anterior) => {
                const siguiente = { oculta: oculta ?? anterior.oculta, compacta };
                return siguiente.oculta === anterior.oculta && siguiente.compacta === anterior.compacta
                    ? anterior
                    : siguiente;
            });
        };

        const alScrollear = () => {
            if (pendiente) return;
            pendiente = true;
            requestAnimationFrame(medir);
        };

        window.addEventListener("scroll", alScrollear, { passive: true });
        return () => window.removeEventListener("scroll", alScrollear);
    }, []);

    return estado;
};

import { useEffect, useRef, useState } from "react";
import { prefiereMenosMovimiento } from "../utils/motion";

// Un número que "corre" hasta su nuevo valor en lugar de saltar. Con reducir movimiento cambia de una vez.
export const useNumeroAnimado = (objetivo, duracion = 550) => {
    const [valor, setValor] = useState(objetivo);
    const actual = useRef(objetivo);

    useEffect(() => {
        if (prefiereMenosMovimiento() || actual.current === objetivo) {
            actual.current = objetivo;
            setValor(objetivo);
            return undefined;
        }
        const desde = actual.current;
        const inicio = performance.now();
        let cuadro;
        const paso = (ahora) => {
            const avance = Math.min(1, (ahora - inicio) / duracion);
            const suave = 1 - Math.pow(1 - avance, 3);
            actual.current = desde + (objetivo - desde) * suave;
            setValor(actual.current);
            if (avance < 1) cuadro = requestAnimationFrame(paso);
        };
        cuadro = requestAnimationFrame(paso);
        return () => cancelAnimationFrame(cuadro);
    }, [objetivo, duracion]);

    return Math.round(valor);
};

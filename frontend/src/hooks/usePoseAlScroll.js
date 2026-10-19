import { useEffect, useRef } from "react";
import { estadoChurro } from "../components/churro3d/poses";
import { ScrollTrigger } from "../utils/smoothScroll";

// Devuelve un ref para la sección: cuando ocupa el centro de la pantalla, el churro adopta esa pose.
export const usePoseAlScroll = (nombre, { inicio = "top 55%", fin = "bottom 45%" } = {}) => {
    const ref = useRef(null);

    useEffect(() => {
        const disparador = ScrollTrigger.create({
            trigger: ref.current,
            start: inicio,
            end: fin,
            onToggle: (self) => {
                if (self.isActive) estadoChurro.pose = nombre;
            }
        });
        return () => disparador.kill();
    }, [nombre, inicio, fin]);

    return ref;
};

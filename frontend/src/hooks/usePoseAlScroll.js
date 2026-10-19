import { useEffect, useRef } from "react";
import { estadoChurro } from "../components/churro3d/poses";
import { ScrollTrigger } from "../utils/smoothScroll";

// Las secciones cuyo rango contiene ahora el centro de la pantalla, con la posición de scroll donde empieza cada una.
const activas = new Map();

// Los rangos de secciones vecinas se pisan un poco. Si hay varias activas, manda la que empieza más abajo en la
// página: así la pose es la misma bajando que subiendo. Si no hay ninguna, se conserva la que estaba.
const elegirPose = () => {
    if (activas.size === 0) return;
    estadoChurro.pose = [...activas.entries()].sort((a, b) => b[1] - a[1])[0][0];
};

// Devuelve un ref para la sección: cuando ocupa el centro de la pantalla, el churro adopta esa pose.
export const usePoseAlScroll = (nombre, { inicio = "top 55%", fin = "bottom 45%" } = {}) => {
    const ref = useRef(null);

    useEffect(() => {
        const disparador = ScrollTrigger.create({
            trigger: ref.current,
            start: inicio,
            end: fin,
            onToggle: (self) => {
                if (self.isActive) activas.set(nombre, self.start);
                else activas.delete(nombre);
                elegirPose();
            }
        });
        return () => {
            disparador.kill();
            activas.delete(nombre);
        };
    }, [nombre, inicio, fin]);

    return ref;
};

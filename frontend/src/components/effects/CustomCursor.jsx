import { useEffect, useRef, useState } from "react";
import { gsap } from "../../utils/smoothScroll";
import { hayPunteroFino, prefiereMenosMovimiento } from "../../utils/motion";

// Un círculo que sigue al puntero y cambia al pasar por encima de algo clickeable.
// El cursor del sistema sigue visible: esto es un adorno, no lo reemplaza.
export default function CustomCursor() {
    const circulo = useRef(null);
    const [activo, setActivo] = useState(false);
    const [visto, setVisto] = useState(false);
    const [etiqueta, setEtiqueta] = useState("");
    const [sobreAccion, setSobreAccion] = useState(false);

    useEffect(() => {
        if (!hayPunteroFino() || prefiereMenosMovimiento()) return undefined;
        setActivo(true);

        const moverX = gsap.quickTo(circulo.current, "x", { duration: 0.45, ease: "power3" });
        const moverY = gsap.quickTo(circulo.current, "y", { duration: 0.45, ease: "power3" });

        const alMover = (evento) => {
            moverX(evento.clientX);
            moverY(evento.clientY);
            setVisto(true);
        };
        const alEntrar = (evento) => {
            const objetivo = evento.target.closest?.("[data-cursor], a, button, summary, label, select, input");
            setSobreAccion(Boolean(objetivo));
            setEtiqueta(objetivo?.dataset?.cursor ?? "");
        };

        window.addEventListener("pointermove", alMover);
        window.addEventListener("pointerover", alEntrar);
        return () => {
            window.removeEventListener("pointermove", alMover);
            window.removeEventListener("pointerover", alEntrar);
        };
    }, []);

    if (!activo && !hayPunteroFino()) return null;

    return (
        <div
            className={`cursor ${visto ? "cursor--visto" : ""} ${sobreAccion ? "cursor--accion" : ""} ${etiqueta ? "cursor--etiqueta" : ""}`}
            ref={circulo}
            aria-hidden="true"
        >
            <span className="cursor__texto">{etiqueta}</span>
        </div>
    );
}

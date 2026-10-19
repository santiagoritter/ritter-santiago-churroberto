import { useEffect, useRef } from "react";
import { gsap } from "../../utils/smoothScroll";
import { velocidadScroll } from "../../utils/smoothScroll";
import { prefiereMenosMovimiento } from "../../utils/motion";
import Estrella from "../ui/Estrella";

// Cinta de frases que corre sola y se acelera con la velocidad del scroll.
export default function Marquee({ frases, inversa = false, duracion = 36, className = "" }) {
    const pista = useRef(null);

    useEffect(() => {
        if (prefiereMenosMovimiento()) return undefined;
        const animacion = pista.current.getAnimations()[0];
        if (!animacion) return undefined;

        let actual = 1;
        const alTick = () => {
            const objetivo = 1 + Math.min(Math.abs(velocidadScroll()) * 0.35, 6);
            actual += (objetivo - actual) * 0.08;
            animacion.playbackRate = actual;
        };
        gsap.ticker.add(alTick);
        return () => gsap.ticker.remove(alTick);
    }, []);

    const bloque = (clave) => (
        <span className="cinta__bloque" key={clave}>
            {frases.map((frase) => (
                <span className="cinta__frase" key={frase}>
                    {frase}
                    <Estrella tamano={30} />
                </span>
            ))}
        </span>
    );

    return (
        <div className={`cinta ${inversa ? "cinta--inversa" : ""} ${className}`.trim()} aria-hidden="true">
            <div className="cinta__pista" ref={pista} style={{ "--duracion": `${duracion}s` }}>
                {bloque("a")}
                {bloque("b")}
            </div>
        </div>
    );
}

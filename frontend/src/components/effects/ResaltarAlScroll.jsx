import { useEffect, useRef } from "react";
import { gsap, ScrollTrigger } from "../../utils/smoothScroll";
import { prefiereMenosMovimiento } from "../../utils/motion";

// Texto grande que se "enciende" palabra por palabra a medida que se hace scroll.
export default function ResaltarAlScroll({ como: Etiqueta = "p", texto, className = "" }) {
    const ref = useRef(null);
    const palabras = texto.split(" ");

    useEffect(() => {
        if (prefiereMenosMovimiento()) return undefined;
        const contexto = gsap.context(() => {
            gsap.fromTo(
                ".resalte__palabra",
                { opacity: 0.18 },
                {
                    opacity: 1,
                    ease: "none",
                    stagger: 0.12,
                    scrollTrigger: {
                        trigger: ref.current,
                        start: "top 80%",
                        end: "bottom 45%",
                        scrub: true
                    }
                }
            );
        }, ref);
        ScrollTrigger.refresh();
        return () => contexto.revert();
    }, [texto]);

    return (
        <Etiqueta ref={ref} className={`resalte ${className}`.trim()}>
            <span className="visualmente-oculto">{texto}</span>
            <span aria-hidden="true">
                {palabras.map((palabra, indice) => (
                    <span key={`${palabra}-${indice}`} className="resalte__palabra">
                        {palabra}{" "}
                    </span>
                ))}
            </span>
        </Etiqueta>
    );
}

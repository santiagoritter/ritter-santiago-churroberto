import { useEffect, useState } from "react";
import { usePoseAlScroll } from "../../hooks/usePoseAlScroll";
import { useMenosMovimiento } from "../../hooks/useMediaQuery";
import { gsap, ScrollTrigger } from "../../utils/smoothScroll";
import { limitar } from "../../utils/format";
import { estadoChurro } from "../churro3d/poses";
import SplitText from "../effects/SplitText";

// Pasos generales de la elaboración de churros. Confirmar el detalle con el dueño.
const PASOS = [
    {
        titulo: "La masa",
        texto: "Se amasa y queda lista para la manga.",
        dibujo: (
            <>
                <path d="M6 24h36q0 16-18 16T6 24z" />
                <path d="M12 24q4-9 12-6 8-6 12 6" />
            </>
        )
    },
    {
        titulo: "La manga",
        texto: "La masa sale con forma de estrella, bien derechita.",
        dibujo: (
            <>
                <path d="M8 10l24 8v12L8 38z" />
                <path d="M32 18h8v12h-8" />
                <path d="M42 24h3" />
            </>
        )
    },
    {
        titulo: "La fritura",
        texto: "Se fríen hasta que se doran.",
        dibujo: (
            <>
                <path d="M5 26h38q0 14-19 14T5 26z" />
                <path d="M14 20q3-5 0-9M24 20q3-5 0-9M34 20q3-5 0-9" />
            </>
        )
    },
    {
        titulo: "El relleno",
        texto: "Dulce de leche o chocolate, al momento.",
        dibujo: (
            <>
                <rect x="6" y="18" width="30" height="14" rx="7" />
                <path d="M30 25h14M40 20l5 5-5 5" />
            </>
        )
    }
];

export default function ComoSeHace() {
    const seccion = usePoseAlScroll("proceso", { inicio: "top 60%", fin: "bottom 40%" });
    const menosMovimiento = useMenosMovimiento();
    const [activo, setActivo] = useState(0);

    useEffect(() => {
        const contexto = gsap.context(() => {
            if (menosMovimiento) {
                ScrollTrigger.create({
                    trigger: seccion.current,
                    start: "top 60%",
                    end: "bottom 40%",
                    onToggle: (self) => {
                        estadoChurro.corte = self.isActive ? 1 : 0;
                    }
                });
                return;
            }
            ScrollTrigger.create({
                trigger: seccion.current,
                start: "top top",
                end: "+=240%",
                pin: ".proceso__escena",
                scrub: true,
                onUpdate: (self) => {
                    const paso = Math.min(PASOS.length - 1, Math.floor(self.progress * PASOS.length));
                    setActivo((anterior) => (anterior === paso ? anterior : paso));
                    estadoChurro.corte = limitar((self.progress - 0.55) / 0.3, 0, 1);
                },
                onLeave: () => {
                    estadoChurro.corte = 0;
                },
                onLeaveBack: () => {
                    estadoChurro.corte = 0;
                    setActivo(0);
                }
            });
        }, seccion);
        return () => {
            contexto.revert();
            estadoChurro.corte = 0;
        };
    }, [menosMovimiento, seccion]);

    return (
        <section
            id="como-se-hace"
            className="seccion proceso campo-chocolate"
            ref={seccion}
            aria-labelledby="titulo-proceso"
        >
            <div className="proceso__escena">
                <div className="proceso__texto">
                    <SplitText como="h2" id="titulo-proceso" className="proceso__titulo" texto="Se hace|delante tuyo" />
                    <ol className="proceso__pasos">
                        {PASOS.map((paso, indice) => (
                            <li
                                key={paso.titulo}
                                className={`paso ${menosMovimiento || indice === activo ? "paso--activo" : ""}`}
                                aria-current={!menosMovimiento && indice === activo ? "step" : undefined}
                            >
                                <svg className="paso__dibujo" viewBox="0 0 48 48" aria-hidden="true" focusable="false">
                                    {paso.dibujo}
                                </svg>
                                <div>
                                    <h3 className="paso__titulo">{paso.titulo}</h3>
                                    <p>{paso.texto}</p>
                                </div>
                            </li>
                        ))}
                    </ol>
                </div>
                <div className="proceso__avance" aria-hidden="true">
                    <span
                        className="proceso__avance-relleno"
                        style={{ "--paso": activo + 1, "--total": PASOS.length }}
                    />
                </div>
            </div>
        </section>
    );
}

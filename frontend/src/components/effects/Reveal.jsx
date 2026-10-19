import { useRevelar } from "../../hooks/useRevelar";

// Hace aparecer a sus hijos cuando entran en pantalla. El efecto se elige con `efecto`: subir, pop, izquierda o derecha.
export default function Reveal({
    como: Etiqueta = "div",
    efecto = "subir",
    retraso = 0,
    giro,
    className = "",
    style,
    children,
    ...resto
}) {
    const ref = useRevelar();
    const estilo = {
        "--retraso": `${retraso}s`,
        ...(giro !== undefined && { "--giro-inicio": `${giro}deg` }),
        ...style
    };

    return (
        <Etiqueta ref={ref} className={`revelar ${className}`.trim()} data-efecto={efecto} style={estilo} {...resto}>
            {children}
        </Etiqueta>
    );
}

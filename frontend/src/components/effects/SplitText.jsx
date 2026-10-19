import { useRevelar } from "../../hooks/useRevelar";

// Titular partido en palabras: cada una sube desde una máscara, una detrás de otra.
// Un "|" en el texto marca un salto de línea.
export default function SplitText({ como: Etiqueta = "h2", texto, className = "", retraso = 0, ...resto }) {
    const ref = useRevelar({ umbral: 0.3 });
    const lineas = texto.split("|");
    let indice = 0;

    return (
        <Etiqueta
            ref={ref}
            className={`partido ${className}`.trim()}
            aria-label={lineas.join(" ")}
            style={{ "--retraso": `${retraso}s` }}
            {...resto}
        >
            {lineas.map((linea) => (
                <span className="partido__linea" key={linea} aria-hidden="true">
                    {linea.split(" ").map((palabra, posicion, palabras) => {
                        const i = indice;
                        indice += 1;
                        return (
                            <span key={`${palabra}-${i}`}>
                                <span className="palabra">
                                    <span className="palabra__interior" style={{ "--i": i }}>
                                        {palabra}
                                    </span>
                                </span>
                                {posicion < palabras.length - 1 && " "}
                            </span>
                        );
                    })}
                </span>
            ))}
        </Etiqueta>
    );
}

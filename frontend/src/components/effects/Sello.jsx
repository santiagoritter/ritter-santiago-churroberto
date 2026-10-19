import { useId } from "react";
import Estrella from "../ui/Estrella";

// Sello circular con texto que gira con el scroll (o solo, si el navegador no soporta scroll-timeline).
// El texto trae sus propios separadores, por ejemplo "Hecho a la vista * Villa Urquiza *".
export default function Sello({ texto, className = "" }) {
    const id = useId();

    return (
        <div className={`sello ${className}`.trim()} aria-hidden="true">
            <svg className="sello__giro" viewBox="0 0 200 200" focusable="false">
                <defs>
                    <path id={id} d="M100 100m-76 0a76 76 0 1 1 152 0a76 76 0 1 1-152 0" />
                </defs>
                <text className="sello__texto">
                    <textPath href={`#${id}`} startOffset="0" textLength="474" lengthAdjust="spacing">
                        {texto}
                    </textPath>
                </text>
            </svg>
            <span className="sello__centro">
                <Estrella tamano={46} />
            </span>
        </div>
    );
}

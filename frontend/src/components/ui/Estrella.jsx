import { PUNTOS_ESTRELLA } from "../../utils/estrella";

// La cara del churro vista de frente: una estrella de diez puntas. Es el motivo de toda la identidad.
export default function Estrella({ tamano = 24, className, style }) {
    return (
        <svg
            className={className}
            style={style}
            width={tamano}
            height={tamano}
            viewBox="0 0 40 40"
            aria-hidden="true"
            focusable="false"
        >
            <polygon
                points={PUNTOS_ESTRELLA}
                fill="currentColor"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinejoin="round"
            />
        </svg>
    );
}

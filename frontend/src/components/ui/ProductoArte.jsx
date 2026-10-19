// Ilustraciones de producto dibujadas en SVG: el local todavía no tiene fotos propias.
const TINTA = "#2b120b";
const MASA = "#e3a03b";
const MASA_OSCURA = "#b9731f";

function Churro({ rotacion = -24, relleno, escala = 1, desplazar = [0, 0] }) {
    return (
        <g transform={`translate(${desplazar[0]} ${desplazar[1]}) rotate(${rotacion} 100 75) scale(${escala})`}>
            <rect x="20" y="52" width="158" height="46" rx="23" fill={MASA} stroke={TINTA} strokeWidth="5" />
            <path d="M42 66H158M42 75H158M42 84H158" stroke={MASA_OSCURA} strokeWidth="3.5" strokeLinecap="round" />
            <ellipse cx="176" cy="75" rx="9" ry="22" fill="#f2c06a" stroke={TINTA} strokeWidth="4" />
            {relleno ? (
                <>
                    <path
                        d="M174 62c10-6 24-2 22 10-1 5 2 8 0 13-3 7-14 6-20 2z"
                        fill={relleno}
                        stroke={TINTA}
                        strokeWidth="4"
                        strokeLinejoin="round"
                    />
                    <path
                        d="M183 66c4 0 7 2 8 5"
                        fill="none"
                        stroke="#ffffff"
                        strokeWidth="3"
                        strokeLinecap="round"
                        opacity=".75"
                    />
                </>
            ) : (
                <circle cx="176" cy="75" r="4" fill={TINTA} />
            )}
        </g>
    );
}

function Factura() {
    return (
        <g>
            <path
                d="M30 100C30 56 62 36 100 36s70 20 70 64c0 6-5 10-11 10H41c-6 0-11-4-11-10z"
                fill={MASA}
                stroke={TINTA}
                strokeWidth="5"
                strokeLinejoin="round"
            />
            <path
                d="M58 100C58 72 76 54 100 54M100 54c24 0 42 18 42 46M82 100C82 82 90 68 100 62M118 100c0-18-8-32-18-38"
                fill="none"
                stroke={MASA_OSCURA}
                strokeWidth="3.5"
                strokeLinecap="round"
            />
        </g>
    );
}

const COLORES_RELLENO = { chocolate: "#4b2314", dulce: "#c57a1e" };

export default function ProductoArte({ nombre = "", categoria = "", titulo }) {
    const texto = `${nombre} ${categoria}`.toLowerCase();
    const relleno = texto.includes("chocolate") ? COLORES_RELLENO.chocolate : COLORES_RELLENO.dulce;
    const esFactura = texto.includes("factura");
    const esCombo = texto.includes("surtida") || texto.includes("combo");
    const esRelleno = texto.includes("rellen");

    return (
        <svg
            className="producto-arte"
            viewBox="0 0 200 150"
            role={titulo ? "img" : undefined}
            aria-label={titulo}
            aria-hidden={titulo ? undefined : true}
            focusable="false"
        >
            {esFactura && <Factura />}
            {!esFactura && esCombo && (
                <>
                    <Churro rotacion={-38} escala={0.8} desplazar={[-6, 8]} relleno={COLORES_RELLENO.dulce} />
                    <Churro rotacion={-14} escala={0.8} desplazar={[4, -4]} relleno={COLORES_RELLENO.chocolate} />
                    <Churro rotacion={10} escala={0.8} desplazar={[10, -14]} />
                </>
            )}
            {!esFactura && !esCombo && <Churro relleno={esRelleno ? relleno : undefined} />}
        </svg>
    );
}

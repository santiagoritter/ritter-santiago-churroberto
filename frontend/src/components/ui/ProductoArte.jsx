// Ilustraciones de producto dibujadas en SVG: el local todavía no tiene fotos propias.
const TINTA = "#2b120b";
const MASA = "#e3a03b";
const MASA_OSCURA = "#b9731f";
const PIOLIN = "#e5412d";
const RELLENOS = { chocolate: "#4b2314", dulce: "#c57a1e" };

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

// Sticker redondo con la cantidad: una docena son 12 y media docena, 6. Partido en dos colores para la docena surtida.
function Cantidad({ cx, cy, valor, surtida }) {
    return (
        <g>
            {surtida ? (
                <>
                    <path d={`M${cx} ${cy - 19}A19 19 0 0 0 ${cx} ${cy + 19}Z`} fill={RELLENOS.dulce} />
                    <path d={`M${cx} ${cy - 19}A19 19 0 0 1 ${cx} ${cy + 19}Z`} fill={RELLENOS.chocolate} />
                </>
            ) : (
                <circle cx={cx} cy={cy} r="19" fill="#ffd84a" />
            )}
            <circle cx={cx} cy={cy} r="19" fill="none" stroke={TINTA} strokeWidth="4" />
            <text
                x={cx}
                y={cy + 7}
                textAnchor="middle"
                fill={surtida ? "#ffffff" : TINTA}
                style={{ fontFamily: "var(--fuente-titulo)", fontSize: 20 }}
            >
                {valor}
            </text>
        </g>
    );
}

// La caja blanca de panadería atada con piolín, que es como se lleva una docena.
function Caja({ cantidad, surtida }) {
    return (
        <g>
            <ellipse cx="100" cy="138" rx="66" ry="7" fill={TINTA} opacity=".14" />
            <polygon
                points="150,64 176,44 176,112 150,132"
                fill="#e9e4da"
                stroke={TINTA}
                strokeWidth="5"
                strokeLinejoin="round"
            />
            <polygon
                points="34,64 60,44 176,44 150,64"
                fill="#ffffff"
                stroke={TINTA}
                strokeWidth="5"
                strokeLinejoin="round"
            />
            <rect
                x="34"
                y="64"
                width="116"
                height="68"
                fill="#ffffff"
                stroke={TINTA}
                strokeWidth="5"
                strokeLinejoin="round"
            />
            <path d="M92 64V132M34 98H150M92 64L118 44M150 98L176 78" stroke={PIOLIN} strokeWidth="5" />
            <path
                d="M92 98C78 78 60 88 74 98C60 108 78 118 92 98ZM92 98C106 78 124 88 110 98C124 108 106 118 92 98Z"
                fill={PIOLIN}
                stroke={TINTA}
                strokeWidth="3.5"
                strokeLinejoin="round"
            />
            <circle cx="92" cy="98" r="5" fill={PIOLIN} stroke={TINTA} strokeWidth="3" />
            <Cantidad cx={138} cy={120} valor={cantidad} surtida={surtida} />
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

export default function ProductoArte({ nombre = "", categoria = "", titulo, nombreTransicion }) {
    const texto = `${nombre} ${categoria}`.toLowerCase();
    const relleno = texto.includes("chocolate") ? RELLENOS.chocolate : RELLENOS.dulce;
    const esFactura = texto.includes("factura");
    const esSurtida = texto.includes("surtida") || texto.includes("combo");
    const esRelleno = texto.includes("rellen");
    const cantidad = texto.includes("media docena") ? 6 : texto.includes("docena") ? 12 : null;

    let dibujo = <Churro />;
    if (esFactura) dibujo = <Factura />;
    else if (esSurtida) dibujo = <Caja cantidad={cantidad ?? 12} surtida />;
    else if (esRelleno) {
        dibujo = (
            <>
                <Churro relleno={relleno} />
                {cantidad && <Cantidad cx={34} cy={116} valor={cantidad} />}
            </>
        );
    } else if (cantidad) dibujo = <Caja cantidad={cantidad} />;

    return (
        <svg
            className="producto-arte"
            viewBox="0 0 200 150"
            role={titulo ? "img" : undefined}
            aria-label={titulo}
            aria-hidden={titulo ? undefined : true}
            focusable="false"
            // Mismo nombre en la ficha y en el detalle: el dibujo viaja de una pantalla a la otra.
            style={nombreTransicion ? { viewTransitionName: nombreTransicion } : undefined}
        >
            {dibujo}
        </svg>
    );
}

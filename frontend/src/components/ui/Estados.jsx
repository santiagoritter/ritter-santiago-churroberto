import Button from "./Button";
import Spinner from "./Spinner";

export function Cargando({ etiqueta = "Cargando" }) {
    return (
        <div className="estado estado--cargando">
            <Spinner etiqueta={etiqueta} tamano={44} />
            <p aria-hidden="true">{etiqueta}…</p>
        </div>
    );
}

export function EstadoError({ mensaje, alReintentar, nivel = 2 }) {
    const Titulo = `h${nivel}`;
    return (
        <div className="estado estado--error" role="alert">
            <Titulo className="estado__titulo">No pudimos cargar esto</Titulo>
            <p>{mensaje}</p>
            {alReintentar && (
                <Button variante="secundario" onClick={alReintentar}>
                    Intentar de nuevo
                </Button>
            )}
        </div>
    );
}

export function EstadoVacio({ titulo, mensaje, accion, children, nivel = 2 }) {
    const Titulo = `h${nivel}`;
    return (
        <div className="estado estado--vacio">
            {children}
            <Titulo className="estado__titulo">{titulo}</Titulo>
            {mensaje && <p>{mensaje}</p>}
            {accion}
        </div>
    );
}

export function Esqueleto({ alto = "1rem", ancho = "100%", className = "" }) {
    return <span className={`esqueleto ${className}`} style={{ height: alto, width: ancho }} aria-hidden="true" />;
}

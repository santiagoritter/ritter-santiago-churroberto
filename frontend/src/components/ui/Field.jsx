import { useId } from "react";

// Envuelve cualquier control con su label, su ayuda y su mensaje de error, bien asociados.
function Campo({ etiqueta, error, ayuda, obligatorio, children }) {
    const id = useId();
    const idAyuda = ayuda ? `${id}-ayuda` : undefined;
    const idError = error ? `${id}-error` : undefined;
    const describedBy = [idAyuda, idError].filter(Boolean).join(" ") || undefined;

    return (
        <div className={`campo ${error ? "campo--error" : ""}`}>
            <label className="campo__etiqueta" htmlFor={id}>
                {etiqueta}
                {obligatorio && <span className="campo__obligatorio"> (obligatorio)</span>}
            </label>
            {children({ id, "aria-invalid": error ? true : undefined, "aria-describedby": describedBy })}
            {ayuda && (
                <p className="campo__ayuda" id={idAyuda}>
                    {ayuda}
                </p>
            )}
            {error && (
                <p className="campo__error" id={idError}>
                    {error}
                </p>
            )}
        </div>
    );
}

export function Input({ etiqueta, error, ayuda, obligatorio, ...resto }) {
    return (
        <Campo etiqueta={etiqueta} error={error} ayuda={ayuda} obligatorio={obligatorio}>
            {(propsCampo) => <input className="campo__control" required={obligatorio} {...propsCampo} {...resto} />}
        </Campo>
    );
}

export function Textarea({ etiqueta, error, ayuda, obligatorio, ...resto }) {
    return (
        <Campo etiqueta={etiqueta} error={error} ayuda={ayuda} obligatorio={obligatorio}>
            {(propsCampo) => (
                <textarea className="campo__control" rows={3} required={obligatorio} {...propsCampo} {...resto} />
            )}
        </Campo>
    );
}

export function Select({ etiqueta, error, ayuda, obligatorio, opciones, placeholder, ...resto }) {
    return (
        <Campo etiqueta={etiqueta} error={error} ayuda={ayuda} obligatorio={obligatorio}>
            {(propsCampo) => (
                <select className="campo__control" required={obligatorio} {...propsCampo} {...resto}>
                    {placeholder && <option value="">{placeholder}</option>}
                    {opciones.map((opcion) => (
                        <option key={opcion.valor} value={opcion.valor}>
                            {opcion.etiqueta}
                        </option>
                    ))}
                </select>
            )}
        </Campo>
    );
}

// Grupo de opciones tipo tarjeta (por ejemplo retiro o envío).
export function OpcionesTarjeta({ leyenda, nombre, valor, opciones, alCambiar }) {
    return (
        <fieldset className="opciones-tarjeta">
            <legend className="campo__etiqueta">{leyenda}</legend>
            <div className="opciones-tarjeta__lista">
                {opciones.map((opcion) => (
                    <label className="opciones-tarjeta__opcion" key={opcion.valor}>
                        <input
                            type="radio"
                            name={nombre}
                            value={opcion.valor}
                            checked={valor === opcion.valor}
                            onChange={() => alCambiar(opcion.valor)}
                        />
                        <span className="opciones-tarjeta__cuerpo">
                            <strong>{opcion.etiqueta}</strong>
                            {opcion.detalle && <small>{opcion.detalle}</small>}
                        </span>
                    </label>
                ))}
            </div>
        </fieldset>
    );
}

import { useEffect, useRef } from "react";
import { prefiereMenosMovimiento } from "../../utils/motion";

// Botones tipo etiqueta para elegir una opción (categoría, estado…). Cada opción puede llevar un contador.
// En el celular es una fila que se desliza; la opción elegida siempre queda a la vista.
export default function Filtros({ etiqueta, opciones, valor, alElegir }) {
    const lista = useRef(null);

    useEffect(() => {
        const contenedor = lista.current;
        const activo = contenedor?.querySelector('[aria-pressed="true"]');
        if (!activo) return;
        const izquierda = activo.offsetLeft - (contenedor.clientWidth - activo.offsetWidth) / 2;
        contenedor.scrollTo({ left: Math.max(0, izquierda), behavior: prefiereMenosMovimiento() ? "auto" : "smooth" });
    }, [valor]);

    return (
        <div className="filtros" role="group" aria-label={etiqueta} ref={lista}>
            {opciones.map((opcion) => (
                <button
                    type="button"
                    key={opcion.valor}
                    className="filtro"
                    aria-pressed={valor === opcion.valor}
                    onClick={() => alElegir(opcion.valor)}
                >
                    {opcion.etiqueta}
                    {opcion.cuenta !== undefined && <span className="filtro__cuenta">{opcion.cuenta}</span>}
                </button>
            ))}
        </div>
    );
}

import Icon from "./Icon";

export default function QuantityStepper({ valor, maximo, alCambiar, nombre }) {
    return (
        <div className="stepper" role="group" aria-label={`Cantidad de ${nombre}`}>
            <button
                type="button"
                className="stepper__boton"
                onClick={() => alCambiar(valor - 1)}
                aria-label={`Quitar uno de ${nombre}`}
            >
                <Icon nombre="menos" tamano={18} />
            </button>
            <output className="stepper__valor" aria-live="polite">
                {valor}
            </output>
            <button
                type="button"
                className="stepper__boton"
                onClick={() => alCambiar(valor + 1)}
                disabled={valor >= maximo}
                aria-label={`Sumar uno de ${nombre}`}
            >
                <Icon nombre="mas" tamano={18} />
            </button>
        </div>
    );
}

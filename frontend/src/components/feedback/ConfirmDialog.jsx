import { useEffect, useRef } from "react";
import { pausarScroll, reanudarScroll } from "../../utils/smoothScroll";
import Button from "../ui/Button";

// Confirmación antes de una acción que no se puede deshacer. Usa <dialog>, que ya atrapa el foco y cierra con Esc.
export default function ConfirmDialog({ opciones, alResponder }) {
    const dialogo = useRef(null);

    useEffect(() => {
        const elemento = dialogo.current;
        if (opciones && !elemento.open) {
            elemento.showModal();
            pausarScroll();
        }
        if (!opciones && elemento.open) {
            elemento.close();
            reanudarScroll();
        }
    }, [opciones]);

    return (
        <dialog
            ref={dialogo}
            className="dialogo"
            aria-labelledby="dialogo-titulo"
            aria-describedby="dialogo-mensaje"
            data-lenis-prevent
            onCancel={(evento) => {
                evento.preventDefault();
                alResponder(false);
            }}
        >
            {opciones && (
                <div className="dialogo__cuerpo">
                    <h2 className="dialogo__titulo" id="dialogo-titulo">
                        {opciones.titulo}
                    </h2>
                    <p id="dialogo-mensaje">{opciones.mensaje}</p>
                    <div className="dialogo__acciones">
                        <Button variante="secundario" onClick={() => alResponder(false)} autoFocus>
                            {opciones.cancelar ?? "Cancelar"}
                        </Button>
                        <Button variante={opciones.peligro ? "peligro" : "primario"} onClick={() => alResponder(true)}>
                            {opciones.confirmar ?? "Confirmar"}
                        </Button>
                    </div>
                </div>
            )}
        </dialog>
    );
}

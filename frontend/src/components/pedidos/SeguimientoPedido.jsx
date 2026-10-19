import Estrella from "../ui/Estrella";
import Icon from "../ui/Icon";

const ETAPAS_RETIRO = ["PENDIENTE", "EN_PREPARACION", "LISTO", "ENTREGADO"];
const ETAPAS_ENVIO = ["PENDIENTE", "EN_PREPARACION", "LISTO", "EN_CAMINO", "ENTREGADO"];
const ROTULOS = {
    PENDIENTE: "Recibido",
    EN_PREPARACION: "Preparando",
    LISTO: "Listo",
    EN_CAMINO: "En camino",
    ENTREGADO: "Entregado"
};

// El recorrido del pedido en pasos. La etapa actual se marca con texto además de con color.
export default function SeguimientoPedido({ estado, tipoEntrega }) {
    if (estado === "CANCELADO") {
        return (
            <p className="seguimiento seguimiento--cancelado" role="status">
                Este pedido se canceló.
            </p>
        );
    }

    const etapas = tipoEntrega === "ENVIO" ? ETAPAS_ENVIO : ETAPAS_RETIRO;
    const actual = etapas.indexOf(estado);

    return (
        <ol className="seguimiento" aria-label="Estado del pedido" style={{ "--pasos": etapas.length }}>
            {etapas.map((etapa, indice) => {
                const hecho = indice < actual;
                const clases = `seguimiento__paso ${hecho ? "seguimiento__paso--hecho" : ""} ${indice === actual ? "seguimiento__paso--actual" : ""}`;
                return (
                    <li key={etapa} className={clases} aria-current={indice === actual ? "step" : undefined}>
                        <span className="seguimiento__marca" aria-hidden="true">
                            {hecho ? <Icon nombre="check" tamano={18} /> : <Estrella tamano={18} />}
                        </span>
                        <span className="seguimiento__rotulo">
                            {ROTULOS[etapa]}
                            <span className="visualmente-oculto">
                                {hecho ? " (listo)" : indice === actual ? " (ahora)" : " (todavía no)"}
                            </span>
                        </span>
                    </li>
                );
            })}
        </ol>
    );
}

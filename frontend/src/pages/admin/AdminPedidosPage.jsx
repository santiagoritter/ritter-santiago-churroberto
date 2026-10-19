import { useState } from "react";
import Button from "../../components/ui/Button";
import { Cargando, EstadoError, EstadoVacio } from "../../components/ui/Estados";
import Insignia from "../../components/ui/Insignia";
import { useConfirm } from "../../context/ConfirmContext";
import { useToast } from "../../context/ToastContext";
import { useAsync } from "../../hooks/useAsync";
import { useTitulo } from "../../hooks/useTitulo";
import { cambiarEstadoPedido, listarTodosLosPedidos } from "../../services/pedidosService";
import {
    ETIQUETAS_ENTREGA,
    ETIQUETAS_ESTADO,
    TONO_ESTADO,
    ETIQUETAS_PAGO,
    formatearFecha,
    formatearPrecio
} from "../../utils/format";

// Qué estados puede tener un pedido a continuación (la API valida lo mismo).
const SIGUIENTES = {
    PENDIENTE: ["EN_PREPARACION", "CANCELADO"],
    EN_PREPARACION: ["LISTO", "CANCELADO"],
    LISTO: ["EN_CAMINO", "ENTREGADO"],
    EN_CAMINO: ["ENTREGADO"],
    ENTREGADO: [],
    CANCELADO: []
};

export default function AdminPedidosPage() {
    useTitulo("Administrar pedidos");
    const toast = useToast();
    const confirmar = useConfirm();
    const [actualizando, setActualizando] = useState(null);
    const { datos, error, cargando, recargar } = useAsync((signal) => listarTodosLosPedidos({ signal }));

    const mover = async (pedido, estado) => {
        if (estado === "CANCELADO") {
            const acepto = await confirmar({
                titulo: `¿Cancelar el pedido ${pedido.id}?`,
                mensaje: "Se devuelve el stock y no se puede deshacer.",
                confirmar: "Sí, cancelar",
                cancelar: "No, dejarlo",
                peligro: true
            });
            if (!acepto) return;
        }
        setActualizando(pedido.id);
        try {
            await cambiarEstadoPedido(pedido.id, estado);
            toast.exito(`El pedido ${pedido.id} pasó a “${ETIQUETAS_ESTADO[estado]}”.`);
            recargar();
        } catch (fallo) {
            toast.error(fallo.message);
        } finally {
            setActualizando(null);
        }
    };

    return (
        <div className="admin__contenido">
            <h2 className="admin__subtitulo">Pedidos recibidos</h2>

            {cargando && <Cargando etiqueta="Cargando los pedidos" />}
            {error && <EstadoError mensaje={error.message} alReintentar={recargar} />}
            {datos?.length === 0 && (
                <EstadoVacio titulo="Todavía no entró ningún pedido" mensaje="Cuando alguien pida, aparece acá." />
            )}

            {datos?.length > 0 && (
                <ul className="lista-pedidos">
                    {datos.map((pedido) => (
                        <li key={pedido.id} className="tarjeta-pedido sticker">
                            <div className="tarjeta-pedido__cabecera">
                                <h3 className="tarjeta-pedido__titulo">Pedido {pedido.id}</h3>
                                <Insignia tono={TONO_ESTADO[pedido.estado]}>{ETIQUETAS_ESTADO[pedido.estado]}</Insignia>
                            </div>
                            <p className="tarjeta-pedido__meta">
                                {formatearFecha(pedido.fecha)}. {ETIQUETAS_ENTREGA[pedido.tipoEntrega]}.{" "}
                                {ETIQUETAS_PAGO[pedido.metodoPago]}.
                            </p>
                            {pedido.direccionEntrega && (
                                <p className="tarjeta-pedido__meta">Dirección: {pedido.direccionEntrega}</p>
                            )}
                            <ul className="tarjeta-pedido__items">
                                {pedido.items.map((item) => (
                                    <li key={item.id}>
                                        {item.cantidad} × {item.nombreProducto}
                                    </li>
                                ))}
                            </ul>
                            <div className="tarjeta-pedido__pie">
                                <p className="tarjeta-pedido__total">{formatearPrecio(pedido.total)}</p>
                                <div className="tarjeta-pedido__acciones">
                                    {SIGUIENTES[pedido.estado]
                                        .filter((estado) => estado !== "EN_CAMINO" || pedido.tipoEntrega === "ENVIO")
                                        .map((estado) => (
                                            <Button
                                                key={estado}
                                                tamano="chico"
                                                variante={estado === "CANCELADO" ? "peligro" : "primario"}
                                                cargando={actualizando === pedido.id}
                                                onClick={() => mover(pedido, estado)}
                                            >
                                                {estado === "CANCELADO"
                                                    ? "Cancelar"
                                                    : `Pasar a ${ETIQUETAS_ESTADO[estado].toLowerCase()}`}
                                            </Button>
                                        ))}
                                </div>
                            </div>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}

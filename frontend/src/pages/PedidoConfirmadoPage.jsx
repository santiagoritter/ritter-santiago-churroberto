import { useCallback, useMemo } from "react";
import { useParams } from "react-router-dom";
import SeguimientoPedido from "../components/pedidos/SeguimientoPedido";
import Estrella from "../components/ui/Estrella";
import SplitText from "../components/effects/SplitText";
import Button from "../components/ui/Button";
import { Cargando, EstadoError } from "../components/ui/Estados";
import Insignia from "../components/ui/Insignia";
import { useAsync } from "../hooks/useAsync";
import { useAvisoDeEstado } from "../hooks/useAvisoDeEstado";
import { useRefrescoPeriodico } from "../hooks/useRefrescoPeriodico";
import { useTitulo } from "../hooks/useTitulo";
import { obtenerPedido } from "../services/pedidosService";
import {
    ETIQUETAS_ENTREGA,
    ETIQUETAS_ESTADO,
    TONO_ESTADO,
    ETIQUETAS_PAGO,
    formatearFecha,
    formatearPrecio
} from "../utils/format";

export default function PedidoConfirmadoPage() {
    useTitulo("Pedido confirmado");
    const { id } = useParams();
    const { datos: pedido, error, cargando, recargar } = useAsync((signal) => obtenerPedido(id, { signal }), [id]);

    // Si el pedido sigue en curso, se mira cada tanto cómo va. useAvisoDeEstado espera una lista.
    const enCurso = Boolean(pedido) && !["ENTREGADO", "CANCELADO"].includes(pedido.estado);
    const refrescar = useCallback(() => recargar(), [recargar]);
    useRefrescoPeriodico(refrescar, { activo: enCurso });
    const comoLista = useMemo(() => (pedido ? [pedido] : null), [pedido]);
    useAvisoDeEstado(comoLista);

    if (cargando) return <Cargando etiqueta="Cargando tu pedido" />;

    if (error) {
        return (
            <section className="pagina campo-celeste">
                <div className="pagina__interior">
                    <EstadoError nivel={1} mensaje={error.message} alReintentar={recargar} />
                </div>
            </section>
        );
    }

    return (
        <section className="pagina campo-manteca" aria-labelledby="titulo-confirmado">
            <div className="pagina__interior pagina__interior--angosto">
                <div className="festejo" aria-hidden="true">
                    {[0, 1, 2, 3, 4, 5].map((i) => (
                        <Estrella
                            key={i}
                            tamano={26 + (i % 3) * 14}
                            className={`festejo__estrella festejo__estrella--${i}`}
                        />
                    ))}
                </div>
                <SplitText como="h1" id="titulo-confirmado" className="pagina__titulo" texto="¡Pedido en|marcha!" />
                <p className="pagina__bajada">Anotamos tu pedido número {pedido.id}. El pago se hace al recibirlo.</p>

                <SeguimientoPedido estado={pedido.estado} tipoEntrega={pedido.tipoEntrega} />

                <div className="comprobante sticker">
                    <p className="comprobante__fila">
                        <span>Estado</span>
                        <Insignia tono={TONO_ESTADO[pedido.estado]}>{ETIQUETAS_ESTADO[pedido.estado]}</Insignia>
                    </p>
                    <p className="comprobante__fila">
                        <span>Entrega</span>
                        <strong>{ETIQUETAS_ENTREGA[pedido.tipoEntrega]}</strong>
                    </p>
                    {pedido.direccionEntrega && (
                        <p className="comprobante__fila">
                            <span>Dirección</span>
                            <strong>{pedido.direccionEntrega}</strong>
                        </p>
                    )}
                    <p className="comprobante__fila">
                        <span>Pago</span>
                        <strong>{ETIQUETAS_PAGO[pedido.metodoPago]}</strong>
                    </p>
                    <p className="comprobante__fila">
                        <span>Fecha</span>
                        <strong>{formatearFecha(pedido.fecha)}</strong>
                    </p>
                    <ul className="comprobante__items">
                        {pedido.items.map((item) => (
                            <li key={item.id}>
                                <span>
                                    {item.cantidad} × {item.nombreProducto}
                                </span>
                                <strong>{formatearPrecio(item.subtotal)}</strong>
                            </li>
                        ))}
                    </ul>
                    <p className="comprobante__total">
                        <span>Total</span>
                        <strong>{formatearPrecio(pedido.total)}</strong>
                    </p>
                </div>

                <div className="pagina__acciones">
                    <Button to="/mis-pedidos">Ver mis pedidos</Button>
                    <Button to="/menu" variante="secundario">
                        Pedir algo más
                    </Button>
                </div>
            </div>
        </section>
    );
}

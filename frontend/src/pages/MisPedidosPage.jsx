import { useState } from "react";
import SplitText from "../components/effects/SplitText";
import Button from "../components/ui/Button";
import { Cargando, EstadoError, EstadoVacio } from "../components/ui/Estados";
import Insignia from "../components/ui/Insignia";
import { useConfirm } from "../context/ConfirmContext";
import { useToast } from "../context/ToastContext";
import { useAsync } from "../hooks/useAsync";
import { useTitulo } from "../hooks/useTitulo";
import { cancelarPedido, listarMisPedidos } from "../services/pedidosService";
import { ETIQUETAS_ENTREGA, ETIQUETAS_ESTADO, TONO_ESTADO, formatearFecha, formatearPrecio } from "../utils/format";

export default function MisPedidosPage() {
    useTitulo("Mis pedidos");
    const toast = useToast();
    const confirmar = useConfirm();
    const { datos, error, cargando, recargar } = useAsync((signal) => listarMisPedidos({ signal }));
    const [cancelando, setCancelando] = useState(null);

    const cancelar = async (pedido) => {
        const acepto = await confirmar({
            titulo: `¿Cancelar el pedido ${pedido.id}?`,
            mensaje: "No se puede deshacer. Si ya lo habías pagado, coordiná la devolución con el local.",
            confirmar: "Sí, cancelar",
            cancelar: "No, dejarlo",
            peligro: true
        });
        if (!acepto) return;

        setCancelando(pedido.id);
        try {
            await cancelarPedido(pedido.id);
            toast.exito(`Cancelamos el pedido ${pedido.id}.`);
            recargar();
        } catch (fallo) {
            toast.error(fallo.message);
        } finally {
            setCancelando(null);
        }
    };

    return (
        <section className="pagina campo-celeste" aria-labelledby="titulo-mis-pedidos">
            <div className="pagina__interior">
                <SplitText como="h1" id="titulo-mis-pedidos" className="pagina__titulo" texto="Mis pedidos" />

                {cargando && <Cargando etiqueta="Cargando tus pedidos" />}
                {error && <EstadoError mensaje={error.message} alReintentar={recargar} />}

                {datos?.length === 0 && (
                    <EstadoVacio
                        titulo="Todavía no hiciste ningún pedido"
                        mensaje="Cuando pidas, lo vas a ver acá."
                        accion={<Button to="/menu">Ver el menú</Button>}
                    />
                )}

                {datos?.length > 0 && (
                    <ul className="lista-pedidos">
                        {datos.map((pedido) => (
                            <li key={pedido.id} className="tarjeta-pedido sticker">
                                <div className="tarjeta-pedido__cabecera">
                                    <h2 className="tarjeta-pedido__titulo">Pedido {pedido.id}</h2>
                                    <Insignia tono={TONO_ESTADO[pedido.estado]}>
                                        {ETIQUETAS_ESTADO[pedido.estado]}
                                    </Insignia>
                                </div>
                                <p className="tarjeta-pedido__meta">
                                    {formatearFecha(pedido.fecha)}. {ETIQUETAS_ENTREGA[pedido.tipoEntrega]}.
                                </p>
                                <ul className="tarjeta-pedido__items">
                                    {pedido.items.map((item) => (
                                        <li key={item.id}>
                                            {item.cantidad} × {item.nombreProducto}
                                        </li>
                                    ))}
                                </ul>
                                <div className="tarjeta-pedido__pie">
                                    <p className="tarjeta-pedido__total">{formatearPrecio(pedido.total)}</p>
                                    {pedido.estado === "PENDIENTE" && (
                                        <Button
                                            variante="peligro"
                                            tamano="chico"
                                            icono="cerrar"
                                            cargando={cancelando === pedido.id}
                                            onClick={() => cancelar(pedido)}
                                        >
                                            Cancelar pedido
                                        </Button>
                                    )}
                                </div>
                            </li>
                        ))}
                    </ul>
                )}
            </div>
        </section>
    );
}

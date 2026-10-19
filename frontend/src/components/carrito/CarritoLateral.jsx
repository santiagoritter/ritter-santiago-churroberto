import { useEffect, useRef, useState } from "react";
import { useCart } from "../../context/CartContext";
import { useNumeroAnimado } from "../../hooks/useNumeroAnimado";
import { formatearPrecio } from "../../utils/format";
import { pausarScroll, reanudarScroll } from "../../utils/smoothScroll";
import Button from "../ui/Button";
import { EstadoVacio } from "../ui/Estados";
import Icon from "../ui/Icon";
import ProductoArte from "../ui/ProductoArte";
import QuantityStepper from "../ui/QuantityStepper";

const DURACION_SALIDA_MS = 300;

// El pedido a mano desde cualquier pantalla: se abre desde la cabecera o desde el aviso "Ver pedido".
export default function CarritoLateral() {
    const { cajonAbierto, cerrarCajon, items, total, cambiarCantidad, quitar } = useCart();
    const dialogo = useRef(null);
    const [cerrando, setCerrando] = useState(false);
    const totalAnimado = useNumeroAnimado(total);

    // Abrir es inmediato; cerrar espera a que termine la animación de salida.
    useEffect(() => {
        const elemento = dialogo.current;
        if (cajonAbierto) {
            setCerrando(false);
            if (!elemento.open) {
                elemento.showModal();
                pausarScroll();
            }
            return undefined;
        }
        if (!elemento.open) return undefined;
        setCerrando(true);
        const espera = setTimeout(() => {
            elemento.close();
            setCerrando(false);
            reanudarScroll();
        }, DURACION_SALIDA_MS);
        return () => clearTimeout(espera);
    }, [cajonAbierto]);

    return (
        <dialog
            ref={dialogo}
            className="cajon"
            data-cerrando={cerrando || undefined}
            aria-labelledby="cajon-titulo"
            data-lenis-prevent
            closedby="any"
            onCancel={(evento) => {
                evento.preventDefault();
                cerrarCajon();
            }}
            onClose={() => {
                reanudarScroll();
                cerrarCajon();
            }}
        >
            <div className="cajon__interior">
                <header className="cajon__cabecera">
                    <h2 className="cajon__titulo" id="cajon-titulo">
                        Mi pedido
                    </h2>
                    <button type="button" className="cajon__cerrar" onClick={cerrarCajon} aria-label="Cerrar el pedido">
                        <Icon nombre="cerrar" />
                    </button>
                </header>

                {items.length === 0 ? (
                    <div className="cajon__vacio">
                        <EstadoVacio
                            nivel={3}
                            titulo="Todavía no sumaste nada"
                            mensaje="Elegí algo del menú y acá lo ves."
                            accion={
                                <Button to="/menu" onClick={cerrarCajon} iconoDespues="flecha">
                                    Ver el menú
                                </Button>
                            }
                        >
                            <ProductoArte nombre="Churros" />
                        </EstadoVacio>
                    </div>
                ) : (
                    <>
                        <ul className="cajon__items">
                            {items.map((item, indice) => (
                                <li className="cajon-item" key={item.productoId} style={{ "--i": indice }}>
                                    <div className="cajon-item__arte">
                                        <ProductoArte nombre={item.nombre} />
                                    </div>
                                    <div className="cajon-item__datos">
                                        <p className="cajon-item__nombre">{item.nombre}</p>
                                        <p className="cajon-item__precio">
                                            {formatearPrecio(item.precio * item.cantidad)}
                                        </p>
                                    </div>
                                    <QuantityStepper
                                        valor={item.cantidad}
                                        maximo={item.stock}
                                        alCambiar={(valor) => cambiarCantidad(item.productoId, valor)}
                                        nombre={item.nombre}
                                    />
                                    <button
                                        type="button"
                                        className="cajon-item__quitar"
                                        onClick={() => quitar(item.productoId)}
                                        aria-label={`Quitar ${item.nombre} del pedido`}
                                    >
                                        <Icon nombre="basura" tamano={20} />
                                    </button>
                                </li>
                            ))}
                        </ul>
                        <footer className="cajon__pie">
                            <p className="cajon__total">
                                <span>Total</span>
                                <strong>{formatearPrecio(totalAnimado)}</strong>
                            </p>
                            <Button to="/pedido" tamano="grande" onClick={cerrarCajon} iconoDespues="flecha">
                                Confirmar pedido
                            </Button>
                            <Button variante="fantasma" onClick={cerrarCajon}>
                                Seguir mirando
                            </Button>
                        </footer>
                    </>
                )}
            </div>
        </dialog>
    );
}

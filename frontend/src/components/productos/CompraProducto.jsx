import { useState } from "react";
import { useCart } from "../../context/CartContext";
import { useToast } from "../../context/ToastContext";
import { chispas } from "../../utils/chispas";
import { formatearPrecio } from "../../utils/format";
import { volarAlCarrito } from "../../utils/volarAlCarrito";
import { reaccionarChurro } from "../churro3d/poses";
import Button from "../ui/Button";
import QuantityStepper from "../ui/QuantityStepper";

// Lo que se puede hacer con un producto en su detalle: ver el precio, elegir la cantidad y sumarlo al pedido.
export default function CompraProducto({ producto }) {
    const { agregar, items, abrirCajon } = useCart();
    const toast = useToast();
    const [cantidad, setCantidad] = useState(1);

    const enPedido = items.find((item) => item.productoId === producto.id)?.cantidad ?? 0;
    const disponible = Math.max(0, producto.stock - enPedido);

    const sumar = (evento) => {
        volarAlCarrito(document.querySelector(".detalle__arte .producto-arte"));
        chispas(evento.currentTarget);
        reaccionarChurro();
        agregar(producto, cantidad);
        toast.exito(`Sumaste ${cantidad} ${cantidad === 1 ? "unidad" : "unidades"} de ${producto.nombre}.`, {
            texto: "Ver pedido",
            alHacer: abrirCajon
        });
        setCantidad(1);
    };

    return (
        <div className="detalle__info">
            <h1 className="pagina__titulo pagina__titulo--chico" id="titulo-producto">
                {producto.nombre}
            </h1>
            <p className="detalle__texto">{producto.descripcion}</p>
            <p className="detalle__precio">{formatearPrecio(producto.precio)}</p>
            {disponible === 0 ? (
                <p className="detalle__aviso" role="status">
                    {producto.stock === 0 ? "Por ahora no hay stock." : "Ya sumaste todo lo que hay disponible."}
                </p>
            ) : (
                <>
                    {disponible <= 5 && <p className="detalle__aviso">Quedan pocas unidades.</p>}
                    <div className="detalle__acciones">
                        <QuantityStepper
                            valor={cantidad}
                            maximo={disponible}
                            alCambiar={(valor) => setCantidad(Math.max(1, valor))}
                            nombre={producto.nombre}
                        />
                        <Button icono="carrito" onClick={sumar}>
                            Sumar al pedido
                        </Button>
                    </div>
                </>
            )}
            {enPedido > 0 && (
                <p className="detalle__nota">
                    Ya tenés {enPedido} en tu pedido.{" "}
                    <Button to="/pedido" variante="fantasma" tamano="chico">
                        Ver mi pedido
                    </Button>
                </p>
            )}
        </div>
    );
}

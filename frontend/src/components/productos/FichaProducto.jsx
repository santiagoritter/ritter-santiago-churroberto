import { Link } from "react-router-dom";
import { useCart } from "../../context/CartContext";
import { useToast } from "../../context/ToastContext";
import { formatearPrecio } from "../../utils/format";
import { useInclinacion } from "../../hooks/useInclinacion";
import { chispas } from "../../utils/chispas";
import { volarAlCarrito } from "../../utils/volarAlCarrito";
import { reaccionarChurro } from "../churro3d/poses";
import Button from "../ui/Button";
import ProductoArte from "../ui/ProductoArte";

const CAMPOS = ["manteca", "celeste", "azucar", "frutilla"];

// Un producto como si fuera un sticker: dibujo, nombre, precio y botón de sumar.
export default function FichaProducto({ producto, categoria, indice = 0, nivelTitulo = 3 }) {
    const Titulo = `h${nivelTitulo}`;
    const { agregar, items, abrirCajon } = useCart();
    const ref = useInclinacion();
    const toast = useToast();
    const enPedido = items.find((item) => item.productoId === producto.id)?.cantidad ?? 0;
    const sinStock = producto.stock <= 0;
    const alTope = enPedido >= producto.stock;
    const campo = CAMPOS[indice % CAMPOS.length];
    const inclinacion = [-2.2, 1.6, -1.2, 2.4][indice % 4];

    const sumar = (evento) => {
        volarAlCarrito(evento.currentTarget.closest(".ficha")?.querySelector(".producto-arte"));
        chispas(evento.currentTarget);
        reaccionarChurro();
        agregar(producto, 1);
        toast.exito(`Sumaste ${producto.nombre} a tu pedido.`, { texto: "Ver pedido", alHacer: abrirCajon });
    };

    return (
        <article ref={ref} className={`ficha ficha--${campo}`} style={{ "--inclinacion": `${inclinacion}deg` }}>
            <Link
                to={`/menu/${producto.id}`}
                state={{ producto, categoria }}
                className="ficha__arte"
                viewTransition
                aria-label={`Ver ${producto.nombre}`}
                data-cursor="Ver"
            >
                <ProductoArte nombre={producto.nombre} categoria={categoria} nombreTransicion={`arte-${producto.id}`} />
            </Link>
            <div className="ficha__cuerpo">
                <Titulo className="ficha__nombre">
                    <Link to={`/menu/${producto.id}`} state={{ producto, categoria }} viewTransition>
                        {producto.nombre}
                    </Link>
                </Titulo>
                <p className="ficha__texto">{producto.descripcion}</p>
                <div className="ficha__pie">
                    <p className="ficha__precio">{formatearPrecio(producto.precio)}</p>
                    <Button tamano="chico" icono="mas" onClick={sumar} disabled={sinStock || alTope}>
                        {sinStock ? "Sin stock" : alTope ? "Ya tenés el máximo" : "Sumar"}
                    </Button>
                </div>
            </div>
        </article>
    );
}

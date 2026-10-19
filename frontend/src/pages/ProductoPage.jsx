import { useState } from "react";
import { useParams } from "react-router-dom";
import Button from "../components/ui/Button";
import { Cargando, EstadoError, EstadoVacio } from "../components/ui/Estados";
import ProductoArte from "../components/ui/ProductoArte";
import QuantityStepper from "../components/ui/QuantityStepper";
import { useCart } from "../context/CartContext";
import { useToast } from "../context/ToastContext";
import { useAsync } from "../hooks/useAsync";
import { useTitulo } from "../hooks/useTitulo";
import { listarCategorias } from "../services/categoriasService";
import { obtenerProducto } from "../services/productosService";
import { formatearPrecio } from "../utils/format";

export default function ProductoPage() {
    const { id } = useParams();
    const { agregar, items } = useCart();
    const toast = useToast();
    const [cantidad, setCantidad] = useState(1);

    const producto = useAsync((signal) => obtenerProducto(id, { signal }), [id]);
    const categorias = useAsync((signal) => listarCategorias({ signal }));
    useTitulo(producto.datos?.nombre ?? "Producto");

    if (producto.cargando) return <Cargando etiqueta="Cargando el producto" />;

    if (producto.error?.status === 404 || producto.error?.status === 400) {
        return (
            <section className="pagina campo-celeste">
                <div className="pagina__interior">
                    <EstadoVacio
                        nivel={1}
                        titulo="No encontramos este producto"
                        mensaje="Puede que ya no esté en el menú."
                        accion={<Button to="/menu">Ver el menú</Button>}
                    />
                </div>
            </section>
        );
    }

    if (producto.error) {
        return (
            <section className="pagina campo-celeste">
                <div className="pagina__interior">
                    <EstadoError nivel={1} mensaje={producto.error.message} alReintentar={producto.recargar} />
                </div>
            </section>
        );
    }

    const datos = producto.datos;
    const categoria = categorias.datos?.find((c) => c.id === datos.categoriaId)?.nombre ?? "";
    const enPedido = items.find((item) => item.productoId === datos.id)?.cantidad ?? 0;
    const disponible = Math.max(0, datos.stock - enPedido);

    const sumar = () => {
        agregar(datos, cantidad);
        toast.exito(`Sumaste ${cantidad} ${cantidad === 1 ? "unidad" : "unidades"} de ${datos.nombre}.`);
        setCantidad(1);
    };

    return (
        <section className="pagina campo-celeste" aria-labelledby="titulo-producto">
            <div className="pagina__interior">
                <Button to="/menu" variante="fantasma" tamano="chico" icono="flechaIzquierda">
                    Volver al menú
                </Button>
                <div className="detalle">
                    <div className="detalle__arte sticker">
                        <ProductoArte
                            nombre={datos.nombre}
                            categoria={categoria}
                            titulo={`Dibujo de ${datos.nombre}`}
                        />
                    </div>
                    <div className="detalle__info">
                        <h1 className="pagina__titulo pagina__titulo--chico" id="titulo-producto">
                            {datos.nombre}
                        </h1>
                        <p className="detalle__texto">{datos.descripcion}</p>
                        <p className="detalle__precio">{formatearPrecio(datos.precio)}</p>
                        {disponible === 0 ? (
                            <p className="detalle__aviso" role="status">
                                {datos.stock === 0
                                    ? "Por ahora no hay stock."
                                    : "Ya sumaste todo lo que hay disponible."}
                            </p>
                        ) : (
                            <>
                                {disponible <= 5 && <p className="detalle__aviso">Quedan pocas unidades.</p>}
                                <div className="detalle__acciones">
                                    <QuantityStepper
                                        valor={cantidad}
                                        maximo={disponible}
                                        alCambiar={(valor) => setCantidad(Math.max(1, valor))}
                                        nombre={datos.nombre}
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
                </div>
            </div>
        </section>
    );
}

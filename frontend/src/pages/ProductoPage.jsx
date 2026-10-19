import { useMemo } from "react";
import { useLocation, useParams } from "react-router-dom";
import CompraProducto from "../components/productos/CompraProducto";
import Relacionados from "../components/productos/Relacionados";
import Button from "../components/ui/Button";
import { Cargando, EstadoError, EstadoVacio } from "../components/ui/Estados";
import ProductoArte from "../components/ui/ProductoArte";
import { useAsync } from "../hooks/useAsync";
import { useTitulo } from "../hooks/useTitulo";
import { listarCategorias } from "../services/categoriasService";
import { listarProductos, obtenerProducto } from "../services/productosService";

// Cuando el producto no existe más o la API falla: un mensaje en lugar de la ficha.
function ProductoSinDatos({ error, alReintentar }) {
    const noExiste = error.status === 404 || error.status === 400;
    return (
        <section className="pagina campo-celeste">
            <div className="pagina__interior">
                {noExiste ? (
                    <EstadoVacio
                        nivel={1}
                        titulo="No encontramos este producto"
                        mensaje="Puede que ya no esté en el menú."
                        accion={<Button to="/menu">Ver el menú</Button>}
                    />
                ) : (
                    <EstadoError nivel={1} mensaje={error.message} alReintentar={alReintentar} />
                )}
            </div>
        </section>
    );
}

export default function ProductoPage() {
    const { id } = useParams();
    // Si se llegó desde el menú, ya se conoce el producto: se muestra al instante (y el dibujo viaja de la lista
    // al detalle) mientras se pide la versión actualizada a la API.
    const { state } = useLocation();
    const previo = state?.producto?.id === Number(id) ? state : null;

    const producto = useAsync((signal) => obtenerProducto(id, { signal }), [id]);
    const categorias = useAsync((signal) => listarCategorias({ signal }));
    const todos = useAsync((signal) => listarProductos({ signal }));
    useTitulo(producto.datos?.nombre ?? previo?.producto.nombre ?? "Producto");

    const nombresDeCategoria = useMemo(
        () => new Map(categorias.datos?.map((categoria) => [categoria.id, categoria.nombre])),
        [categorias.datos]
    );

    if (producto.cargando && !previo) return <Cargando etiqueta="Cargando el producto" />;
    if (producto.error) return <ProductoSinDatos error={producto.error} alReintentar={producto.recargar} />;

    const datos = producto.datos ?? previo.producto;
    const categoria = nombresDeCategoria.get(datos.categoriaId) ?? previo?.categoria ?? "";
    const relacionados = (todos.datos ?? []).filter((otro) => otro.id !== datos.id).slice(0, 3);

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
                            nombreTransicion={`arte-${datos.id}`}
                        />
                    </div>
                    <CompraProducto key={datos.id} producto={datos} />
                </div>
                <Relacionados productos={relacionados} nombresDeCategoria={nombresDeCategoria} />
            </div>
        </section>
    );
}

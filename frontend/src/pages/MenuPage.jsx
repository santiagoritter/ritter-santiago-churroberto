import { useSearchParams } from "react-router-dom";
import Reveal from "../components/effects/Reveal";
import SplitText from "../components/effects/SplitText";
import FichaProducto from "../components/productos/FichaProducto";
import { EstadoError, EstadoVacio, Esqueleto } from "../components/ui/Estados";
import { useAsync } from "../hooks/useAsync";
import { useTitulo } from "../hooks/useTitulo";
import { listarCategorias } from "../services/categoriasService";
import { listarProductos } from "../services/productosService";

export default function MenuPage() {
    useTitulo("Menú");
    const [params, setParams] = useSearchParams();
    const categoriaId = params.get("categoria") ? Number(params.get("categoria")) : null;

    const categorias = useAsync((signal) => listarCategorias({ signal }));
    const productos = useAsync((signal) => listarProductos({ categoriaId, signal }), [categoriaId]);

    const elegir = (id) => setParams(id ? { categoria: String(id) } : {}, { replace: true });
    const nombreDe = (producto) => categorias.datos?.find((c) => c.id === producto.categoriaId)?.nombre ?? "";

    return (
        <section className="pagina campo-manteca" aria-labelledby="titulo-menu-pagina">
            <div className="pagina__interior">
                <SplitText como="h1" id="titulo-menu-pagina" className="pagina__titulo" texto="Todo|el menú" />
                <p className="pagina__bajada">Elegí lo que quieras y armá tu pedido. Se paga al recibir.</p>

                <div className="filtros" role="group" aria-label="Filtrar por categoría">
                    <button
                        type="button"
                        className="filtro"
                        aria-pressed={categoriaId === null}
                        onClick={() => elegir(null)}
                    >
                        Todo
                    </button>
                    {categorias.datos?.map((categoria) => (
                        <button
                            type="button"
                            key={categoria.id}
                            className="filtro"
                            aria-pressed={categoriaId === categoria.id}
                            onClick={() => elegir(categoria.id)}
                        >
                            {categoria.nombre}
                        </button>
                    ))}
                </div>

                {productos.cargando && (
                    <div className="rejilla-fichas" aria-busy="true" aria-label="Cargando el menú">
                        {Array.from({ length: 6 }, (_, i) => (
                            <Esqueleto key={i} alto="15rem" className="esqueleto--sticker" />
                        ))}
                    </div>
                )}

                {productos.error && <EstadoError mensaje={productos.error.message} alReintentar={productos.recargar} />}

                {productos.datos?.length === 0 && (
                    <EstadoVacio titulo="Todavía no hay nada acá" mensaje="Probá con otra categoría." />
                )}

                {productos.datos?.length > 0 && (
                    <ul className="rejilla-fichas">
                        {productos.datos.map((producto, indice) => (
                            <Reveal
                                como="li"
                                key={producto.id}
                                efecto="pop"
                                giro={indice % 2 ? 5 : -5}
                                retraso={(indice % 3) * 0.08}
                            >
                                <FichaProducto
                                    producto={producto}
                                    categoria={nombreDe(producto)}
                                    indice={indice}
                                    nivelTitulo={2}
                                />
                            </Reveal>
                        ))}
                    </ul>
                )}
            </div>
        </section>
    );
}

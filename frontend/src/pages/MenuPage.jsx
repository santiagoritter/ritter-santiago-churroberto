import { useMemo } from "react";
import Reveal from "../components/effects/Reveal";
import SplitText from "../components/effects/SplitText";
import FichaProducto from "../components/productos/FichaProducto";
import HerramientasMenu from "../components/productos/HerramientasMenu";
import Button from "../components/ui/Button";
import { EstadoError, EstadoVacio, Esqueleto } from "../components/ui/Estados";
import { useAsync } from "../hooks/useAsync";
import { useFiltrosMenu } from "../hooks/useFiltrosMenu";
import { useFlip } from "../hooks/useFlip";
import { useTitulo } from "../hooks/useTitulo";
import { listarCategorias } from "../services/categoriasService";
import { listarProductos } from "../services/productosService";
import { filtrarProductos, indexarProductos } from "../utils/menu";

export default function MenuPage() {
    useTitulo("Menú");
    const filtros = useFiltrosMenu();
    const { categoriaId, busqueda, orden, limpiar } = filtros;

    // El menú se trae una sola vez: filtrar, buscar y ordenar pasan en el momento, sin esperas.
    const { datos, error, cargando, recargar } = useAsync(async (signal) => {
        const [productos, categorias] = await Promise.all([listarProductos({ signal }), listarCategorias({ signal })]);
        return { productos, categorias };
    });

    const indexados = useMemo(() => (datos ? indexarProductos(datos.productos) : []), [datos]);
    const visibles = useMemo(
        () => filtrarProductos(indexados, { categoriaId, busqueda, orden }),
        [indexados, categoriaId, busqueda, orden]
    );
    const nombresDeCategoria = useMemo(
        () => new Map(datos?.categorias.map((categoria) => [categoria.id, categoria.nombre])),
        [datos]
    );
    const lista = useFlip(visibles.map((producto) => producto.id).join(","));

    return (
        <section className="pagina campo-manteca" aria-labelledby="titulo-menu-pagina">
            <div className="pagina__interior">
                <SplitText como="h1" id="titulo-menu-pagina" className="pagina__titulo" texto="Todo|el menú" />
                <p className="pagina__bajada">Elegí lo que quieras y armá tu pedido. Se paga al recibir.</p>

                {datos && (
                    <HerramientasMenu
                        categorias={datos.categorias}
                        filtros={filtros}
                        cantidadVisible={visibles.length}
                        cantidadTotal={datos.productos.length}
                    />
                )}

                {cargando && (
                    <div className="rejilla-fichas" aria-busy="true" aria-label="Cargando el menú">
                        {Array.from({ length: 6 }, (_, i) => (
                            <Esqueleto key={i} alto="15rem" className="esqueleto--sticker" />
                        ))}
                    </div>
                )}

                {error && <EstadoError mensaje={error.message} alReintentar={recargar} />}

                {datos && visibles.length === 0 && (
                    <EstadoVacio
                        titulo="No encontramos nada así"
                        mensaje="Probá con otra palabra o sacá los filtros."
                        accion={
                            <Button variante="secundario" onClick={limpiar}>
                                Ver todo el menú
                            </Button>
                        }
                    />
                )}

                {visibles.length > 0 && (
                    <ul className="rejilla-fichas" ref={lista}>
                        {visibles.map((producto, indice) => (
                            <Reveal
                                como="li"
                                key={producto.id}
                                data-flip={producto.id}
                                efecto="pop"
                                giro={indice % 2 ? 5 : -5}
                                retraso={(indice % 3) * 0.08}
                            >
                                <FichaProducto
                                    producto={producto}
                                    categoria={nombresDeCategoria.get(producto.categoriaId) ?? ""}
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

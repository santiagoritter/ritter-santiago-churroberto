import { usePoseAlScroll } from "../../hooks/usePoseAlScroll";
import { useAsync } from "../../hooks/useAsync";
import { listarCategorias } from "../../services/categoriasService";
import { listarProductos } from "../../services/productosService";
import Reveal from "../effects/Reveal";
import SplitText from "../effects/SplitText";
import FichaProducto from "../productos/FichaProducto";
import Button from "../ui/Button";
import { EstadoError, Esqueleto } from "../ui/Estados";

export default function MenuDestacado() {
    const ref = usePoseAlScroll("menu", { inicio: "top 60%", fin: "bottom 40%" });
    const { datos, error, cargando, recargar } = useAsync(async (signal) => {
        const [productos, categorias] = await Promise.all([listarProductos({ signal }), listarCategorias({ signal })]);
        return { productos, categorias };
    });

    const categoriaDe = (producto) => datos.categorias.find((c) => c.id === producto.categoriaId)?.nombre ?? "";

    return (
        <section className="seccion menu-home campo-frutilla festoneado" ref={ref} aria-labelledby="titulo-menu">
            <div className="seccion__interior">
                <SplitText como="h2" id="titulo-menu" className="titulo-seccion" texto="Armá|tu docena" />

                {cargando && (
                    <div className="menu-home__lista" aria-busy="true" aria-label="Cargando el menú">
                        {Array.from({ length: 6 }, (_, i) => (
                            <Esqueleto key={i} alto="15rem" className="esqueleto--sticker" />
                        ))}
                    </div>
                )}

                {error && <EstadoError mensaje={error.message} alReintentar={recargar} />}

                {datos && (
                    <ul className="menu-home__lista">
                        {datos.productos.slice(0, 6).map((producto, indice) => (
                            <Reveal
                                como="li"
                                key={producto.id}
                                efecto="pop"
                                giro={indice % 2 ? 6 : -6}
                                retraso={(indice % 3) * 0.1}
                            >
                                <FichaProducto producto={producto} categoria={categoriaDe(producto)} indice={indice} />
                            </Reveal>
                        ))}
                    </ul>
                )}

                <Reveal className="menu-home__pie">
                    <Button to="/menu" tamano="grande" variante="secundario" iconoDespues="flecha">
                        Ver todo el menú
                    </Button>
                </Reveal>
            </div>
        </section>
    );
}

import { usePoseAlScroll } from "../../hooks/usePoseAlScroll";
import { useAsync } from "../../hooks/useAsync";
import { listarResenas } from "../../services/resenasService";
import Reveal from "../effects/Reveal";
import ResaltarAlScroll from "../effects/ResaltarAlScroll";
import SplitText from "../effects/SplitText";
import { EstadoError } from "../ui/Estados";

export default function Resenas() {
    const ref = usePoseAlScroll("resenas", { inicio: "top 55%", fin: "bottom 45%" });
    const { datos, error, recargar } = useAsync((signal) => listarResenas({ signal }));
    const [principal, ...otras] = datos ?? [];

    return (
        <section className="seccion resenas campo-celeste festoneado" ref={ref} aria-labelledby="titulo-resenas">
            <div className="seccion__interior">
                <SplitText como="h2" id="titulo-resenas" className="titulo-seccion" texto="Lo dicen|los vecinos" />

                {error && <EstadoError mensaje={error.message} alReintentar={recargar} />}

                {principal && (
                    <figure className="resenas__principal">
                        <ResaltarAlScroll como="blockquote" className="resenas__cita" texto={principal.texto} />
                        <figcaption>
                            {principal.autor}. {principal.fuente}.
                        </figcaption>
                    </figure>
                )}

                <ul className="resenas__globos">
                    {otras.map((resena, indice) => (
                        <Reveal
                            como="li"
                            key={resena.id}
                            efecto={indice % 2 ? "derecha" : "izquierda"}
                            className={`globo ${indice % 2 ? "globo--derecha" : ""}`}
                        >
                            <figure>
                                <blockquote>{resena.texto}</blockquote>
                                <figcaption>
                                    {resena.autor}. {resena.fuente}.
                                </figcaption>
                            </figure>
                        </Reveal>
                    ))}
                </ul>
            </div>
        </section>
    );
}

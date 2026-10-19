import { usePoseAlScroll } from "../../hooks/usePoseAlScroll";
import { estadoDelLocal } from "../../utils/horarios";
import Magnetico from "../effects/Magnetico";
import Reveal from "../effects/Reveal";
import Sello from "../effects/Sello";
import SplitText from "../effects/SplitText";
import Button from "../ui/Button";
import Estrella from "../ui/Estrella";
import ProductoArte from "../ui/ProductoArte";

export default function Hero({ local, sinWebGL }) {
    const ref = usePoseAlScroll("hero", { inicio: "top 90%", fin: "bottom 45%" });
    const estado = local ? estadoDelLocal(local.horarios) : null;

    return (
        <section className="seccion hero campo-celeste" ref={ref} aria-labelledby="titulo-hero">
            <span className="hero__gigante" aria-hidden="true">
                Churros Churros
            </span>

            <div className="hero__interior">
                <div className="hero__texto">
                    <SplitText
                        como="h1"
                        id="titulo-hero"
                        className="hero__titulo"
                        texto="Churros|hechos|a la vista."
                        retraso={0.1}
                    />
                    <Reveal como="p" className="hero__bajada" retraso={0.55}>
                        Artesanales, con relleno de dulce de leche o chocolate. Pedí tu docena y retirala en el local o
                        pedí que te la llevemos.
                    </Reveal>
                    <Reveal className="hero__acciones" retraso={0.7}>
                        <Magnetico>
                            <Button to="/menu" tamano="grande" iconoDespues="flecha">
                                Pedir una docena
                            </Button>
                        </Magnetico>
                        <Button href="#como-se-hace" variante="fantasma" tamano="grande">
                            Mirá cómo se hace
                        </Button>
                    </Reveal>
                    {estado && (
                        <Reveal
                            como="p"
                            className={`chip-estado ${estado.abierto ? "chip-estado--abierto" : ""}`}
                            retraso={0.85}
                        >
                            <span className="chip-estado__punto" aria-hidden="true" />
                            {estado.texto}
                        </Reveal>
                    )}
                </div>

                {sinWebGL && (
                    <div className="hero__alternativa" aria-hidden="true">
                        <ProductoArte nombre="Rellenos de dulce de leche" />
                    </div>
                )}

                <Reveal efecto="pop" giro={-30} retraso={0.9} className="hero__sello">
                    <Sello texto="Hecho a la vista * Villa Urquiza * Martes a domingo *" />
                </Reveal>
                <Reveal efecto="pop" giro={20} retraso={1.1} className="hero__estrella hero__estrella--uno">
                    <Estrella tamano={64} />
                </Reveal>
                <Reveal efecto="pop" giro={-20} retraso={1.25} className="hero__estrella hero__estrella--dos">
                    <Estrella tamano={38} />
                </Reveal>
            </div>

            <p className="hero__pista" aria-hidden="true">
                Bajá y mirá cómo gira
                <span className="hero__pista-flecha" />
            </p>
        </section>
    );
}

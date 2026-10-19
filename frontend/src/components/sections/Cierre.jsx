import { usePoseAlScroll } from "../../hooks/usePoseAlScroll";
import Magnetico from "../effects/Magnetico";
import Reveal from "../effects/Reveal";
import SplitText from "../effects/SplitText";
import Button from "../ui/Button";

export default function Cierre() {
    const ref = usePoseAlScroll("cierre", { inicio: "top 70%", fin: "bottom 75%" });
    // Cuando asoma el pie, el churro se retira para no quedar detrás del título.
    const salida = usePoseAlScroll("salida", { inicio: "top 75%", fin: "bottom top" });

    return (
        <section className="seccion cierre campo-chocolate festoneado" ref={ref} aria-labelledby="titulo-cierre">
            <div className="cierre__interior">
                <SplitText como="h2" id="titulo-cierre" className="cierre__titulo" texto="¿Una|docena?" />
                <Reveal className="cierre__accion" retraso={0.3}>
                    <Magnetico fuerza={0.45}>
                        <Button to="/menu" tamano="grande" variante="claro" iconoDespues="flecha">
                            Pedir ahora
                        </Button>
                    </Magnetico>
                </Reveal>
            </div>
            <span className="cierre__marca-salida" ref={salida} aria-hidden="true" />
        </section>
    );
}

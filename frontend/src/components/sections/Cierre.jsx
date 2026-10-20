import { useEffect } from "react";
import { reaccionarChurro } from "../churro3d/poses";
import { usePoseAlScroll } from "../../hooks/usePoseAlScroll";
import { useScrollLento } from "../../hooks/useScrollLento";
import { ScrollTrigger } from "../../utils/smoothScroll";
import Magnetico from "../effects/Magnetico";
import Reveal from "../effects/Reveal";
import SplitText from "../effects/SplitText";
import Button from "../ui/Button";

export default function Cierre() {
    const ref = usePoseAlScroll("cierre", { inicio: "top 70%", fin: "bottom 75%" });
    // Cuando asoma el pie, el churro se acomoda en la esquina y se queda ahí hasta el final de la página. El rango
    // se alarga de más a propósito: si terminara justo en el último scroll, al llegar abajo ya no estaría activo.
    const salida = usePoseAlScroll("pie", { inicio: "top 85%", fin: "+=100000" });
    // Desde que se acerca hasta que la pantalla se suelta, la rueda va despacio para disfrutar el momento.
    useScrollLento(ref, { inicio: "top 40%", fin: "bottom bottom", factor: 0.4 });

    // Al quedar la pantalla fija, el churro da su vuelta con salto.
    useEffect(() => {
        const disparador = ScrollTrigger.create({
            trigger: ref.current,
            start: "top 12%",
            onEnter: reaccionarChurro
        });
        return () => disparador.kill();
    }, [ref]);

    return (
        <section className="seccion cierre campo-chocolate festoneado" ref={ref} aria-labelledby="titulo-cierre">
            <div className="cierre__escena">
                <div className="cierre__interior">
                    <SplitText como="h2" id="titulo-cierre" className="cierre__titulo" texto="¿Una|docena?" />
                    <Reveal className="cierre__accion" retraso={0.3}>
                        <Magnetico fuerza={0.45}>
                            <Button to="/menu" tamano="grande" variante="claro" iconoDespues="flecha" data-churro>
                                Pedir ahora
                            </Button>
                        </Magnetico>
                    </Reveal>
                </div>
            </div>
            <span className="cierre__marca-salida" ref={salida} aria-hidden="true" />
        </section>
    );
}

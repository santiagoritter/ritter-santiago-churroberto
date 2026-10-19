import { usePoseAlScroll } from "../../hooks/usePoseAlScroll";
import ResaltarAlScroll from "../effects/ResaltarAlScroll";

export default function Manifiesto() {
    const ref = usePoseAlScroll("manifiesto");

    return (
        <section className="seccion manifiesto campo-manteca festoneado" ref={ref} aria-label="Quiénes somos">
            <div className="manifiesto__interior">
                <ResaltarAlScroll
                    como="p"
                    className="manifiesto__texto"
                    texto="Acá los churros se hacen a la vista, a mano, y se rellenan de dulce de leche o chocolate. Los vecinos dicen que son los mejores del barrio."
                />
            </div>
        </section>
    );
}

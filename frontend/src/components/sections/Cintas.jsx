import Marquee from "../effects/Marquee";

// Dos cintas cruzadas entre secciones: una corre hacia cada lado.
export default function Cintas() {
    return (
        <div className="cintas" aria-hidden="true">
            <Marquee
                className="cinta--cacao"
                frases={["Hecho a la vista", "Relleno de dulce de leche", "Relleno de chocolate", "Villa Urquiza"]}
                duracion={40}
            />
            <Marquee
                className="cinta--frutilla"
                inversa
                frases={["Churros calentitos", "De martes a domingo", "Pedí tu docena", "Hecho a mano"]}
                duracion={46}
            />
        </div>
    );
}

import Estrella from "../ui/Estrella";

// Regla fina en el borde de arriba con una estrella que viaja de un lado al otro mientras se hace scroll.
// Funciona solo con CSS (animation-timeline); si el navegador no lo soporta, no se muestra.
export default function ProgresoScroll() {
    return (
        <div className="progreso" aria-hidden="true">
            <span className="progreso__barra" />
            <span className="progreso__estrella">
                <Estrella tamano={22} />
            </span>
        </div>
    );
}

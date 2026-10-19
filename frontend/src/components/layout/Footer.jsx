import { Link } from "react-router-dom";
import { useLocal } from "../../hooks/useLocal";
import { formatearFranjas } from "../../utils/horarios";
import Estrella from "../ui/Estrella";
import Icon from "../ui/Icon";

export default function Footer() {
    const { local } = useLocal();
    const enlaceMapa = local
        ? `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${local.direccion}, ${local.barrio}, ${local.ciudad}`)}`
        : null;

    return (
        <footer className="pie">
            <div className="pie__interior">
                <div className="pie__marca">
                    <Estrella tamano={44} />
                    <p className="pie__nombre" translate="no">
                        Churroberto
                    </p>
                    <p>{local?.descripcion ?? "Churros hechos a la vista."}</p>
                </div>

                {local && (
                    <>
                        <section className="pie__bloque" aria-labelledby="pie-donde">
                            <h2 className="pie__titulo" id="pie-donde">
                                Dónde estamos
                            </h2>
                            <p>
                                {local.direccion}
                                <br />
                                {local.barrio}, CABA
                            </p>
                            <a className="pie__enlace" href={enlaceMapa} target="_blank" rel="noopener noreferrer">
                                Abrir en Google Maps
                                <Icon nombre="diagonal" tamano={18} />
                                <span className="visualmente-oculto"> (se abre en una pestaña nueva)</span>
                            </a>
                        </section>

                        <section className="pie__bloque" aria-labelledby="pie-horarios">
                            <h2 className="pie__titulo" id="pie-horarios">
                                Horarios
                            </h2>
                            <dl className="pie__horarios">
                                {local.horarios.map((horario) => (
                                    <div key={horario.etiqueta}>
                                        <dt>{horario.etiqueta}</dt>
                                        <dd>{formatearFranjas(horario.franjas)}</dd>
                                    </div>
                                ))}
                            </dl>
                        </section>
                    </>
                )}

                <nav className="pie__bloque" aria-label="Pie de página">
                    <h2 className="pie__titulo">Recorrer</h2>
                    <ul>
                        <li>
                            <Link to="/menu">Menú</Link>
                        </li>
                        <li>
                            <Link to="/pedido">Mi pedido</Link>
                        </li>
                        <li>
                            <Link to="/ingresar">Ingresar</Link>
                        </li>
                    </ul>
                </nav>
            </div>
            <p className="pie__aviso">
                Proyecto académico. El menú y los precios son de ejemplo hasta que el local cargue los suyos.
            </p>
        </footer>
    );
}

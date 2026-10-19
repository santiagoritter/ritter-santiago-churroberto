import { useState } from "react";
import { usePoseAlScroll } from "../../hooks/usePoseAlScroll";
import { estadoDelLocal, formatearFranjas } from "../../utils/horarios";
import Reveal from "../effects/Reveal";
import SplitText from "../effects/SplitText";
import Button from "../ui/Button";
import { Cargando } from "../ui/Estados";
import { useToast } from "../../context/ToastContext";

export default function SeccionLocal({ local, error }) {
    const ref = usePoseAlScroll("local", { inicio: "top 55%", fin: "bottom 45%" });
    const toast = useToast();
    const [copiado, setCopiado] = useState(false);

    const direccionCompleta = local ? `${local.direccion}, ${local.barrio}, ${local.ciudad}` : "";
    const estado = local ? estadoDelLocal(local.horarios) : null;

    const copiar = async () => {
        try {
            await navigator.clipboard.writeText(direccionCompleta);
            setCopiado(true);
            toast.exito("Copiamos la dirección.");
            setTimeout(() => setCopiado(false), 2500);
        } catch {
            toast.error("No pudimos copiar la dirección. Seleccionala y copiala a mano.");
        }
    };

    return (
        <section id="local" className="seccion local campo-manteca festoneado" ref={ref} aria-labelledby="titulo-local">
            <div className="seccion__interior">
                <SplitText como="h2" id="titulo-local" className="titulo-seccion" texto="Pasá a|buscarlos" />

                {error && <p role="alert">{error.message}</p>}
                {!local && !error && <Cargando etiqueta="Cargando los datos del local" />}

                {local && (
                    <div className="local__grilla">
                        <Reveal className="local__datos">
                            <p className="local__direccion">
                                {local.direccion}
                                <br />
                                {local.barrio}, CABA
                            </p>
                            <p className={`chip-estado ${estado.abierto ? "chip-estado--abierto" : ""}`}>
                                <span className="chip-estado__punto" aria-hidden="true" />
                                {estado.texto}
                            </p>
                            <dl className="local__horarios">
                                {local.horarios.map((horario) => (
                                    <div key={horario.etiqueta}>
                                        <dt>{horario.etiqueta}</dt>
                                        <dd>{formatearFranjas(horario.franjas)}</dd>
                                    </div>
                                ))}
                            </dl>
                            <div className="local__acciones">
                                <Button
                                    href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(direccionCompleta)}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    icono="pin"
                                >
                                    Cómo llegar
                                    <span className="visualmente-oculto"> (se abre en una pestaña nueva)</span>
                                </Button>
                                <Button variante="secundario" icono={copiado ? "check" : undefined} onClick={copiar}>
                                    {copiado ? "Copiada" : "Copiar dirección"}
                                </Button>
                            </div>
                        </Reveal>

                        <Reveal efecto="pop" giro={3} className="local__mapa">
                            <iframe
                                title={`Mapa con la ubicación de ${local.nombre}`}
                                loading="lazy"
                                // El mapa es de otro origen (google.com), por eso scripts + same-origin es seguro: sin
                                // allow-same-origin el script de Google falla con un error de consola.
                                sandbox="allow-scripts allow-same-origin allow-popups allow-popups-to-escape-sandbox"
                                referrerPolicy="no-referrer-when-downgrade"
                                src={`https://www.google.com/maps?q=${local.latitud},${local.longitud}&z=16&output=embed`}
                            />
                        </Reveal>
                    </div>
                )}
            </div>
        </section>
    );
}

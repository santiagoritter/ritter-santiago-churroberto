import { useEffect, useRef } from "react";
import Icon from "../ui/Icon";

const ICONOS = { exito: "check", error: "alerta", info: "info" };
const DURACION = { exito: 4500, info: 4500, error: 7500 };

function Aviso({ aviso, alCerrar }) {
    const temporizador = useRef(null);

    const programar = () => {
        clearTimeout(temporizador.current);
        temporizador.current = setTimeout(() => alCerrar(aviso.id), DURACION[aviso.tipo]);
    };
    const pausar = () => clearTimeout(temporizador.current);

    useEffect(() => {
        programar();
        return pausar;
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <div
            className={`aviso aviso--${aviso.tipo} ${aviso.saliendo ? "aviso--saliendo" : ""}`}
            role={aviso.tipo === "error" ? "alert" : "status"}
            onMouseEnter={pausar}
            onMouseLeave={programar}
            onFocus={pausar}
            onBlur={programar}
        >
            <span className="aviso__icono">
                <Icon nombre={ICONOS[aviso.tipo]} tamano={20} />
            </span>
            <div className="aviso__texto">
                <p className="aviso__mensaje">{aviso.mensaje}</p>
                {aviso.accion && (
                    <button
                        type="button"
                        className="aviso__accion"
                        onClick={() => {
                            aviso.accion.alHacer();
                            alCerrar(aviso.id);
                        }}
                    >
                        {aviso.accion.texto}
                    </button>
                )}
            </div>
            <button
                type="button"
                className="aviso__cerrar"
                onClick={() => alCerrar(aviso.id)}
                aria-label="Cerrar aviso"
            >
                <Icon nombre="cerrar" tamano={18} />
            </button>
        </div>
    );
}

export default function ToastViewport({ avisos, alCerrar }) {
    return (
        <div className="avisos">
            {avisos.map((aviso) => (
                <Aviso key={aviso.id} aviso={aviso} alCerrar={alCerrar} />
            ))}
        </div>
    );
}

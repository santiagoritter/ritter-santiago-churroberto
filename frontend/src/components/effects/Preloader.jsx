import { useEffect, useState } from "react";
import { prefiereMenosMovimiento } from "../../utils/motion";
import { guardarSesion, leerSesion } from "../../utils/storage";
import Estrella from "../ui/Estrella";

const CLAVE = "churroberto.precarga";
const DURACION_MS = 1900;

// Cortina de tres franjas, como un toldo, que sube mientras la estrella gira. Solo la primera vez de cada sesión.
export default function Preloader() {
    const [visible, setVisible] = useState(() => !prefiereMenosMovimiento() && !leerSesion(CLAVE));

    useEffect(() => {
        if (!visible) return undefined;
        const raiz = document.documentElement;
        raiz.dataset.precarga = "activa";
        guardarSesion(CLAVE, true);

        const temporizador = setTimeout(() => {
            delete raiz.dataset.precarga;
            window.dispatchEvent(new Event("precarga:fin"));
            setVisible(false);
        }, DURACION_MS);

        return () => {
            clearTimeout(temporizador);
            delete raiz.dataset.precarga;
        };
    }, [visible]);

    if (!visible) return null;

    return (
        <div className="precarga" aria-hidden="true">
            <span className="precarga__franja precarga__franja--1" />
            <span className="precarga__franja precarga__franja--2" />
            <span className="precarga__franja precarga__franja--3" />
            <div className="precarga__marca">
                <Estrella tamano={72} />
                <span className="precarga__nombre">Churroberto</span>
            </div>
        </div>
    );
}

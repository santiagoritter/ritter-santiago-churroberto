import { useEffect, useRef } from "react";
import { Outlet, useLocation } from "react-router-dom";
import { useSmoothScroll } from "../../hooks/useSmoothScroll";
import { irA, irArriba } from "../../utils/smoothScroll";
import CustomCursor from "../effects/CustomCursor";
import Preloader from "../effects/Preloader";
import Footer from "./Footer";
import Header from "./Header";

export default function AppLayout() {
    useSmoothScroll();
    const principal = useRef(null);
    const { pathname, hash } = useLocation();
    const primeraVez = useRef(true);

    // Al cambiar de página: vuelve arriba y lleva el foco al contenido, para quien navega con teclado o lector.
    useEffect(() => {
        if (hash) {
            // La página puede estar cargándose: se reintenta hasta que exista el destino.
            let intentos = 0;
            let temporizador;
            const buscar = () => {
                if (document.querySelector(hash)) irA(hash);
                else if (intentos < 25) {
                    intentos += 1;
                    temporizador = setTimeout(buscar, 150);
                }
            };
            temporizador = setTimeout(buscar, 150);
            return () => clearTimeout(temporizador);
        }
        irArriba();
        if (primeraVez.current) {
            primeraVez.current = false;
        } else {
            principal.current?.focus({ preventScroll: true });
        }
        return undefined;
    }, [pathname, hash]);

    return (
        <>
            <a className="salto" href="#contenido">
                Saltar al contenido
            </a>
            <Preloader />
            <CustomCursor />
            <Header />
            <main id="contenido" ref={principal} tabIndex={-1}>
                <Outlet />
            </main>
            <Footer />
        </>
    );
}

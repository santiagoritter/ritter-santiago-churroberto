import Lenis from "lenis";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { prefiereMenosMovimiento } from "./motion";

gsap.registerPlugin(ScrollTrigger);

let lenis = null;
let alTick = null;

// Un único scroll suave para toda la app. Con "reducir movimiento" se usa el scroll nativo.
export const iniciarScrollSuave = () => {
    if (lenis || prefiereMenosMovimiento()) return () => {};

    lenis = new Lenis({ lerp: 0.1, smoothWheel: true });
    lenis.on("scroll", ScrollTrigger.update);
    alTick = (tiempo) => lenis.raf(tiempo * 1000);
    gsap.ticker.add(alTick);
    gsap.ticker.lagSmoothing(0);

    return () => {
        gsap.ticker.remove(alTick);
        lenis.destroy();
        lenis = null;
        alTick = null;
    };
};

export const obtenerScrollSuave = () => lenis;

export const posicionScroll = () => (lenis ? lenis.scroll : window.scrollY);

export const velocidadScroll = () => (lenis ? lenis.velocity : 0);

export const irA = (destino, opciones = {}) => {
    if (lenis) {
        lenis.scrollTo(destino, { duration: 1.4, ...opciones });
        return;
    }
    const elemento = typeof destino === "string" ? document.querySelector(destino) : destino;
    if (elemento) elemento.scrollIntoView({ behavior: "smooth", block: "start" });
    else if (typeof destino === "number") window.scrollTo({ top: destino });
};

export const irArriba = () => {
    if (lenis) lenis.scrollTo(0, { immediate: true, force: true });
    else window.scrollTo(0, 0);
};

// Mientras hay un diálogo abierto la página de fondo no se desplaza.
export const pausarScroll = () => lenis?.stop();
export const reanudarScroll = () => lenis?.start();

export { gsap, ScrollTrigger };

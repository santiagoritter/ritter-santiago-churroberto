import Lenis from "lenis";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { limitar } from "./format";
import { prefiereMenosMovimiento } from "./motion";

gsap.registerPlugin(ScrollTrigger);

// Topes de velocidad: sin ellos, un golpe fuerte de rueda o un salto largo hacen que todo vaya a los tirones.
export const LIMITES = Object.freeze({
    // Cuántos píxeles puede "adelantarse" el destino del scroll respecto de lo que ya se ve. Con el suavizado
    // actual equivale a unos 2.400 px por segundo como máximo.
    adelantoMaximo: 520,
    // Velocidad media máxima de un salto por enlace, en píxeles por segundo.
    saltoPxPorSegundo: 1800,
    // Velocidad (en unidades de Lenis) que los efectos pueden leer.
    velocidadParaEfectos: 14
});

const VELOCIDAD_RUEDA = 0.8;
const SUAVIZADO = 0.085;

let lenis = null;
let alTick = null;
let saltando = false;
// 1 es la velocidad normal; un valor menor frena la rueda en tramos de la página donde conviene ir despacio.
let freno = 1;
let transicionFreno = null;

// Dónde queda el scroll al llegar a un elemento: Lenis respeta el scroll-margin y el scroll-padding de la cabecera fija.
const metaDeElemento = (elemento) => {
    const margen = parseFloat(getComputedStyle(elemento).scrollMarginTop) || 0;
    const relleno = parseFloat(getComputedStyle(document.documentElement).scrollPaddingTop) || 0;
    return elemento.getBoundingClientRect().top + lenis.scroll - margen - relleno;
};

// Arranca y frena despacio: el pico de velocidad es solo 1,6 veces la velocidad media del salto.
const suaveEnLosExtremos = (t) => -(Math.cos(Math.PI * t) - 1) / 2;

// Se ejecuta antes que Lenis: si la rueda ya empujó el destino demasiado lejos, ese golpe se descarta.
const limitarRueda = (evento) => {
    if (!lenis || saltando || evento.ctrlKey) return;
    const adelanto = lenis.targetScroll - lenis.animatedScroll;
    if (Math.abs(adelanto) > LIMITES.adelantoMaximo * freno && Math.sign(adelanto) === Math.sign(evento.deltaY)) {
        evento.preventDefault();
        evento.stopImmediatePropagation();
    }
};

// Un único scroll suave para toda la app. Con "reducir movimiento" se usa el scroll nativo.
export const iniciarScrollSuave = () => {
    if (lenis || prefiereMenosMovimiento()) return () => {};

    lenis = new Lenis({ lerp: SUAVIZADO, smoothWheel: true, wheelMultiplier: VELOCIDAD_RUEDA });
    window.addEventListener("wheel", limitarRueda, { capture: true, passive: false });
    lenis.on("scroll", ScrollTrigger.update);
    alTick = (tiempo) => lenis.raf(tiempo * 1000);
    gsap.ticker.add(alTick);
    gsap.ticker.lagSmoothing(0);

    return () => {
        transicionFreno?.kill();
        freno = 1;
        window.removeEventListener("wheel", limitarRueda, { capture: true });
        gsap.ticker.remove(alTick);
        lenis.destroy();
        lenis = null;
        alTick = null;
    };
};

// Cambia de a poco la velocidad de la rueda para que la página no se sienta frenada de golpe. Un freno de 0,4 deja la
// rueda al 40 % y también acorta cuánto puede adelantarse el destino, así un golpe fuerte no se salta el tramo.
const ajustarFreno = (factor) => {
    if (!lenis) return;
    transicionFreno?.kill();
    const estado = { freno };
    transicionFreno = gsap.to(estado, {
        freno: factor,
        duration: 0.7,
        ease: "power2.out",
        onUpdate: () => {
            freno = estado.freno;
            // El multiplicador de la rueda lo lee el detector de gestos de Lenis, que guarda su propia copia.
            const multiplicador = VELOCIDAD_RUEDA * freno;
            lenis.options.wheelMultiplier = multiplicador;
            if (lenis.virtualScroll) lenis.virtualScroll.options.wheelMultiplier = multiplicador;
            lenis.options.lerp = SUAVIZADO * (0.55 + 0.45 * freno);
        }
    });
};

export const frenarScroll = (factor = 0.4) => ajustarFreno(factor);
export const soltarScroll = () => ajustarFreno(1);

export const obtenerScrollSuave = () => lenis;

export const posicionScroll = () => (lenis ? lenis.scroll : window.scrollY);

export const velocidadScroll = () =>
    lenis ? limitar(lenis.velocity, -LIMITES.velocidadParaEfectos, LIMITES.velocidadParaEfectos) : 0;

export const irA = (destino, opciones = {}) => {
    if (lenis) {
        const elemento = typeof destino === "string" ? document.querySelector(destino) : destino;
        const metaY = typeof destino === "number" ? destino : elemento && metaDeElemento(elemento);
        // La duración crece con la distancia: un salto largo no cruza la página en un parpadeo.
        const distancia = Number.isFinite(metaY) ? Math.abs(metaY - lenis.scroll) : 0;
        const duracion = limitar(distancia / LIMITES.saltoPxPorSegundo, 0.9, 4);
        saltando = true;
        setTimeout(
            () => {
                saltando = false;
            },
            duracion * 1000 + 250
        );
        lenis.scrollTo(destino, {
            duration: duracion,
            easing: suaveEnLosExtremos,
            // Si el diseño cambió mientras se viajaba (llegaron datos, se cargaron fuentes), un ajuste final lo corrige.
            onComplete: () => {
                if (elemento && Math.abs(metaDeElemento(elemento) - lenis.scroll) > 4) {
                    lenis.scrollTo(elemento, { duration: 0.6, easing: suaveEnLosExtremos });
                }
            },
            ...opciones
        });
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

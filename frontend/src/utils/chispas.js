import { PUNTOS_ESTRELLA } from "./estrella";
import { prefiereMenosMovimiento } from "./motion";

const COLORES = ["#ffd84a", "#ff7db5", "#5bc0f8", "#ffffff"];

// Un puñado de estrellitas sale disparado desde el elemento y se apaga: confirma que algo se sumó.
export const chispas = (origen, cantidad = 9) => {
    if (prefiereMenosMovimiento() || !origen) return;
    const caja = origen.getBoundingClientRect();
    const centroX = caja.left + caja.width / 2;
    const centroY = caja.top + caja.height / 2;

    for (let i = 0; i < cantidad; i += 1) {
        const tamano = 10 + Math.random() * 12;
        const angulo = (i / cantidad) * Math.PI * 2 + Math.random() * 0.6;
        const distancia = 46 + Math.random() * 46;
        const chispa = document.createElementNS("http://www.w3.org/2000/svg", "svg");
        chispa.setAttribute("viewBox", "0 0 40 40");
        chispa.setAttribute("aria-hidden", "true");
        chispa.innerHTML = `<polygon points="${PUNTOS_ESTRELLA}" fill="${COLORES[i % COLORES.length]}" stroke="#ffffff" stroke-width="3" stroke-linejoin="round"/>`;
        Object.assign(chispa.style, {
            position: "fixed",
            left: `${centroX - tamano / 2}px`,
            top: `${centroY - tamano / 2}px`,
            width: `${tamano}px`,
            height: `${tamano}px`,
            zIndex: "95",
            pointerEvents: "none"
        });
        document.body.appendChild(chispa);

        const animacion = chispa.animate(
            [
                { transform: "translate(0, 0) scale(0.3) rotate(0deg)", opacity: 1 },
                {
                    transform: `translate(${Math.cos(angulo) * distancia}px, ${Math.sin(angulo) * distancia}px) scale(1) rotate(160deg)`,
                    opacity: 1,
                    offset: 0.6
                },
                {
                    transform: `translate(${Math.cos(angulo) * distancia * 1.25}px, ${Math.sin(angulo) * distancia * 1.25 + 14}px) scale(0) rotate(260deg)`,
                    opacity: 0
                }
            ],
            { duration: 650 + Math.random() * 200, easing: "cubic-bezier(0.16, 1, 0.3, 1)" }
        );
        animacion.onfinish = () => chispa.remove();
    }
};

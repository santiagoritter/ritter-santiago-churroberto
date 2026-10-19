import * as THREE from "three";
import { PUNTAS, aleatorioFijo } from "./churroGeometria";

const ANCHO = 256;
const ALTO = 512;

// Dibuja una forma y sus copias desplazadas un ancho o un alto: lo que sale por un borde entra por el opuesto,
// así la textura se repite sin costuras ni a lo ancho ni a lo largo.
const conCopias = (x, y, radio, dibujar) => {
    for (const dx of [-ANCHO, 0, ANCHO]) {
        for (const dy of [-ALTO, 0, ALTO]) {
            const cx = x + dx;
            const cy = y + dy;
            if (cx + radio < 0 || cx - radio > ANCHO || cy + radio < 0 || cy - radio > ALTO) continue;
            dibujar(cx, cy);
        }
    }
};

// Masa frita: tostada en las crestas, más clara en los surcos, con manchas suaves y sin vetas rasposas.
export function crearTexturaMasa() {
    const lienzo = document.createElement("canvas");
    lienzo.width = ANCHO;
    lienzo.height = ALTO;
    const ctx = lienzo.getContext("2d");
    const azar = aleatorioFijo(77);

    // La cresta (borde izquierdo y derecho) es la parte más tostada y el surco (centro) la más clara.
    const degradado = ctx.createLinearGradient(0, 0, ANCHO, 0);
    degradado.addColorStop(0, "#d98a2b");
    degradado.addColorStop(0.2, "#eda93f");
    degradado.addColorStop(0.5, "#f7c765");
    degradado.addColorStop(0.8, "#eda93f");
    degradado.addColorStop(1, "#d98a2b");
    ctx.fillStyle = degradado;
    ctx.fillRect(0, 0, ANCHO, ALTO);

    // Manchas tostadas y zonas más doradas, grandes y suaves
    for (let i = 0; i < 90; i += 1) {
        const x = azar() * ANCHO;
        const y = azar() * ALTO;
        const radio = 18 + azar() * 46;
        const oscura = azar() > 0.45;
        conCopias(x, y, radio, (cx, cy) => {
            const mancha = ctx.createRadialGradient(cx, cy, 0, cx, cy, radio);
            mancha.addColorStop(0, oscura ? "rgba(150, 78, 18, 0.2)" : "rgba(255, 232, 160, 0.22)");
            mancha.addColorStop(1, "rgba(0, 0, 0, 0)");
            ctx.fillStyle = mancha;
            ctx.fillRect(cx - radio, cy - radio, radio * 2, radio * 2);
        });
    }

    // Burbujitas de la fritura: puntitos claros y oscuros
    for (let i = 0; i < 220; i += 1) {
        const x = azar() * ANCHO;
        const y = azar() * ALTO;
        const radio = 1 + azar() * 2.4;
        const clara = azar() > 0.5;
        conCopias(x, y, radio, (cx, cy) => {
            ctx.fillStyle = clara ? "rgba(255, 236, 170, 0.35)" : "rgba(130, 66, 14, 0.25)";
            ctx.beginPath();
            ctx.arc(cx, cy, radio, 0, Math.PI * 2);
            ctx.fill();
        });
    }

    const textura = new THREE.CanvasTexture(lienzo);
    textura.wrapS = THREE.RepeatWrapping;
    textura.wrapT = THREE.RepeatWrapping;
    textura.repeat.set(PUNTAS, 1);
    textura.colorSpace = THREE.SRGBColorSpace;
    textura.anisotropy = 8;
    return textura;
}

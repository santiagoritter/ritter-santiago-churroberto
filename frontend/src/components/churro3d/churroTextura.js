import * as THREE from "three";
import { PUNTAS, aleatorioFijo } from "./churroGeometria";

// Textura de masa frita: tostada en las crestas, más clara en los surcos, con manchas y vetas largas.
export function crearTexturaMasa() {
    const ancho = 256;
    const alto = 512;
    const lienzo = document.createElement("canvas");
    lienzo.width = ancho;
    lienzo.height = alto;
    const ctx = lienzo.getContext("2d");
    const azar = aleatorioFijo(77);

    const degradado = ctx.createLinearGradient(0, 0, ancho, 0);
    degradado.addColorStop(0, "#c9792a");
    degradado.addColorStop(0.22, "#e8a23e");
    degradado.addColorStop(0.5, "#f3bf5e");
    degradado.addColorStop(0.78, "#e8a23e");
    degradado.addColorStop(1, "#c9792a");
    ctx.fillStyle = degradado;
    ctx.fillRect(0, 0, ancho, alto);

    // Manchas tostadas
    for (let i = 0; i < 260; i += 1) {
        const x = azar() * ancho;
        const y = azar() * alto;
        const radio = 6 + azar() * 22;
        const mancha = ctx.createRadialGradient(x, y, 0, x, y, radio);
        const oscura = azar() > 0.35;
        mancha.addColorStop(0, oscura ? "rgba(120, 58, 14, 0.22)" : "rgba(255, 226, 150, 0.2)");
        mancha.addColorStop(1, "rgba(0, 0, 0, 0)");
        ctx.fillStyle = mancha;
        ctx.fillRect(x - radio, y - radio, radio * 2, radio * 2);
    }

    // Vetas a lo largo del churro
    for (let i = 0; i < 90; i += 1) {
        const x = azar() * ancho;
        const largo = 60 + azar() * 220;
        const y = azar() * alto;
        ctx.strokeStyle = azar() > 0.5 ? "rgba(110, 52, 12, 0.18)" : "rgba(255, 222, 140, 0.16)";
        ctx.lineWidth = 1 + azar() * 2.5;
        ctx.beginPath();
        ctx.moveTo(x, y);
        ctx.lineTo(x + (azar() - 0.5) * 6, y + largo);
        ctx.stroke();
    }

    const textura = new THREE.CanvasTexture(lienzo);
    textura.wrapS = THREE.RepeatWrapping;
    textura.wrapT = THREE.RepeatWrapping;
    textura.repeat.set(PUNTAS, 1);
    textura.colorSpace = THREE.SRGBColorSpace;
    textura.anisotropy = 8;
    return textura;
}

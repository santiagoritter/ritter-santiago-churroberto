// Estado compartido entre las secciones de la página (que dicen qué pose toca) y el churro 3D (que la dibuja).
// x e y van de -1 a 1 sobre la mitad de la pantalla; escala es relativa al tamaño que entra en el ancho.
export const estadoChurro = {
    pose: "hero",
    corte: 0,
    // Cada vez que sube, el churro da una vuelta extra y "salta" (por ejemplo al sumar algo al pedido).
    impulso: 0,
    // Vale 1 mientras el mouse o el teclado están sobre un botón importante.
    entusiasmo: 0
};

export const reaccionarChurro = () => {
    estadoChurro.impulso += 1;
};

const ESCRITORIO = {
    hero: { x: 0.34, y: 0.0, escala: 1.02, yaw: -0.5, pitch: 0.1, inclinacion: 0.3 },
    manifiesto: { x: -0.78, y: -0.02, escala: 0.48, yaw: 0.35, pitch: -0.06, inclinacion: -0.3 },
    proceso: { x: 0.34, y: 0.0, escala: 1.15, yaw: 0, pitch: -0.1, inclinacion: -0.1, bloquearRoll: true },
    menu: { x: 0.86, y: 0.82, escala: 0.26, yaw: -0.4, pitch: 0, inclinacion: 0.5 },
    resenas: { x: -0.92, y: -0.82, escala: 0.001, yaw: 0.6, pitch: 0, inclinacion: -0.4 },
    local: { x: 0.62, y: 0.68, escala: 0.5, yaw: -0.5, pitch: 0.1, inclinacion: 0.28 },
    cierre: { x: 0.0, y: 0.4, escala: 1.0, yaw: 0.2, pitch: 0.12, inclinacion: -0.16 },
    salida: { x: 0.0, y: 1.1, escala: 0.001, yaw: 0.2, pitch: 0.12, inclinacion: -0.3 }
};

const MOVIL = {
    hero: { x: 0, y: 0.4, escala: 1.12, yaw: -0.5, pitch: 0.1, inclinacion: 0.3 },
    manifiesto: { x: 0.35, y: 0.62, escala: 0.8, yaw: 0.5, pitch: 0, inclinacion: -0.3 },
    proceso: { x: 0, y: 0.34, escala: 1.15, yaw: 0, pitch: -0.1, inclinacion: -0.08, bloquearRoll: true },
    menu: { x: 0.8, y: 0.9, escala: 0.28, yaw: -0.4, pitch: 0, inclinacion: 0.5 },
    resenas: { x: -0.9, y: -0.9, escala: 0.001, yaw: 0.6, pitch: 0, inclinacion: -0.4 },
    local: { x: 0, y: 0.75, escala: 0.001, yaw: -0.5, pitch: 0.1, inclinacion: 0.28 },
    cierre: { x: 0, y: 0.4, escala: 1.15, yaw: 0.2, pitch: 0.12, inclinacion: -0.16 },
    salida: { x: 0, y: 1.1, escala: 0.001, yaw: 0.2, pitch: 0.12, inclinacion: -0.3 }
};

export const obtenerPose = (nombre, esMovil) =>
    (esMovil ? MOVIL : ESCRITORIO)[nombre] ?? (esMovil ? MOVIL : ESCRITORIO).hero;

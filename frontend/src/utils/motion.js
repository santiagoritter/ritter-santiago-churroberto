export const prefiereMenosMovimiento = () =>
    typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

export const hayPunteroFino = () =>
    typeof window !== "undefined" && window.matchMedia("(hover: hover) and (pointer: fine)").matches;

export const hayWebGL = () => {
    try {
        const lienzo = document.createElement("canvas");
        return Boolean(lienzo.getContext("webgl2") || lienzo.getContext("webgl"));
    } catch {
        return false;
    }
};

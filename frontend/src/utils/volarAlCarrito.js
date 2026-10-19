import { prefiereMenosMovimiento } from "./motion";

// Una copia del dibujo del producto "vuela" hasta el carrito de la cabecera: se ve a dónde fue lo que sumaste.
export const volarAlCarrito = (origen) => {
    if (prefiereMenosMovimiento() || !origen) return;
    const destino = document.querySelector(".carrito-boton");
    if (!destino) return;

    const desde = origen.getBoundingClientRect();
    const hasta = destino.getBoundingClientRect();
    // Si la cabecera está escondida, el vuelo apunta a donde va a estar el botón cuando reaparezca.
    const isla = destino.closest(".cabecera__isla");
    const escondidaPor = isla ? new DOMMatrix(getComputedStyle(isla).transform).m42 : 0;
    const dx = hasta.left + hasta.width / 2 - (desde.left + desde.width / 2);
    const dy = hasta.top - escondidaPor + hasta.height / 2 - (desde.top + desde.height / 2);

    const copia = origen.cloneNode(true);
    Object.assign(copia.style, {
        position: "fixed",
        left: `${desde.left}px`,
        top: `${desde.top}px`,
        width: `${desde.width}px`,
        height: `${desde.height}px`,
        margin: "0",
        zIndex: "90",
        pointerEvents: "none",
        transformOrigin: "center",
        viewTransitionName: "none"
    });
    copia.setAttribute("aria-hidden", "true");
    document.body.appendChild(copia);

    const animacion = copia.animate(
        [
            { transform: "translate(0, 0) scale(1) rotate(0deg)", opacity: 1 },
            {
                transform: `translate(${dx * 0.45}px, ${dy * 0.45 - 90}px) scale(0.75) rotate(-14deg)`,
                opacity: 1,
                offset: 0.45
            },
            { transform: `translate(${dx}px, ${dy}px) scale(0.12) rotate(24deg)`, opacity: 0.7 }
        ],
        { duration: 760, easing: "cubic-bezier(0.55, 0, 0.35, 1)" }
    );
    animacion.onfinish = () => copia.remove();
};

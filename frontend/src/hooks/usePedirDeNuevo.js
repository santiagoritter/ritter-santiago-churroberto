import { useCallback, useState } from "react";
import { useCart } from "../context/CartContext";
import { useToast } from "../context/ToastContext";
import { listarProductos } from "../services/productosService";

// Vuelve a armar un pedido anterior en el carrito, con los precios y el stock de hoy.
// Lo que ya no se vende (o se agotó) se deja afuera y se avisa.
export const usePedirDeNuevo = () => {
    const { agregar, abrirCajon } = useCart();
    const toast = useToast();
    const [pidiendoId, setPidiendoId] = useState(null);

    const pedirDeNuevo = useCallback(
        async (pedido) => {
            setPidiendoId(pedido.id);
            try {
                const vigentes = await listarProductos();
                const faltantes = [];
                let agregados = 0;

                pedido.items.forEach((item) => {
                    const producto = vigentes.find((candidato) => candidato.id === item.productoId);
                    if (!producto || producto.stock <= 0) {
                        faltantes.push(item.nombreProducto);
                        return;
                    }
                    agregar(producto, Math.min(item.cantidad, producto.stock));
                    agregados += 1;
                });

                if (agregados === 0) {
                    toast.error("Ya no tenemos ninguno de esos productos disponibles.");
                    return;
                }
                if (faltantes.length > 0) {
                    toast.info(`No pudimos sumar: ${faltantes.join(", ")}. Por ahora no hay disponibles.`);
                } else {
                    toast.exito("Sumamos tu pedido anterior al carrito.");
                }
                abrirCajon();
            } catch (fallo) {
                toast.error(fallo.message);
            } finally {
                setPidiendoId(null);
            }
        },
        [agregar, abrirCajon, toast]
    );

    return { pedirDeNuevo, pidiendoId };
};

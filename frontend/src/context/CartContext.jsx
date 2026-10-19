import { createContext, useContext, useEffect, useMemo, useReducer } from "react";
import { guardarLocal, leerLocal } from "../utils/storage";

const CartContext = createContext(null);
const CLAVE_CARRITO = "churroberto.carrito";

const reducir = (items, accion) => {
    switch (accion.tipo) {
        case "agregar": {
            const { producto, cantidad } = accion;
            const existente = items.find((item) => item.productoId === producto.id);
            const tope = producto.stock;
            if (existente) {
                return items.map((item) =>
                    item.productoId === producto.id
                        ? { ...item, stock: tope, cantidad: Math.min(tope, item.cantidad + cantidad) }
                        : item
                );
            }
            return [
                ...items,
                {
                    productoId: producto.id,
                    nombre: producto.nombre,
                    precio: producto.precio,
                    categoriaId: producto.categoriaId,
                    stock: tope,
                    cantidad: Math.min(tope, cantidad)
                }
            ];
        }
        case "cantidad":
            return items
                .map((item) =>
                    item.productoId === accion.productoId
                        ? { ...item, cantidad: Math.min(item.stock, Math.max(0, accion.cantidad)) }
                        : item
                )
                .filter((item) => item.cantidad > 0);
        case "quitar":
            return items.filter((item) => item.productoId !== accion.productoId);
        case "vaciar":
            return [];
        default:
            return items;
    }
};

export function CartProvider({ children }) {
    const [items, despachar] = useReducer(reducir, null, () => leerLocal(CLAVE_CARRITO, []));

    useEffect(() => {
        guardarLocal(CLAVE_CARRITO, items);
    }, [items]);

    const valor = useMemo(
        () => ({
            items,
            cantidadTotal: items.reduce((suma, item) => suma + item.cantidad, 0),
            total: items.reduce((suma, item) => suma + item.cantidad * item.precio, 0),
            agregar: (producto, cantidad = 1) => despachar({ tipo: "agregar", producto, cantidad }),
            cambiarCantidad: (productoId, cantidad) => despachar({ tipo: "cantidad", productoId, cantidad }),
            quitar: (productoId) => despachar({ tipo: "quitar", productoId }),
            vaciar: () => despachar({ tipo: "vaciar" })
        }),
        [items]
    );

    return <CartContext value={valor}>{children}</CartContext>;
}

export const useCart = () => {
    const contexto = useContext(CartContext);
    if (!contexto) throw new Error("useCart debe usarse dentro de CartProvider");
    return contexto;
};

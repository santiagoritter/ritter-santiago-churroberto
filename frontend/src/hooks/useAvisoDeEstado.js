import { useCallback, useEffect, useRef } from "react";
import { useToast } from "../context/ToastContext";
import { ETIQUETAS_ESTADO } from "../utils/format";

// Compara los pedidos con los de la vez anterior y avisa si alguno cambió de estado.
// Devuelve `registrar(id, estado)` para los cambios que hace la propia persona: esos ya tienen su aviso.
export const useAvisoDeEstado = (pedidos) => {
    const toast = useToast();
    const anteriores = useRef(null);

    useEffect(() => {
        if (!pedidos) return;
        const actuales = new Map(pedidos.map((pedido) => [pedido.id, pedido.estado]));
        if (anteriores.current) {
            actuales.forEach((estado, id) => {
                const antes = anteriores.current.get(id);
                if (!antes || antes === estado) return;
                toast.info(
                    estado === "CANCELADO"
                        ? `Se canceló el pedido ${id}.`
                        : `Tu pedido ${id} ahora está: ${ETIQUETAS_ESTADO[estado].toLowerCase()}.`
                );
            });
        }
        anteriores.current = actuales;
    }, [pedidos, toast]);

    return useCallback((id, estado) => anteriores.current?.set(id, estado), []);
};

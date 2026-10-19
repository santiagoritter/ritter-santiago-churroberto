import { useCallback } from "react";
import { useSearchParams } from "react-router-dom";

// Categoría, búsqueda y orden del menú. Todo vive en la dirección de la página: se puede compartir y funciona el "atrás".
export const useFiltrosMenu = () => {
    const [params, setParams] = useSearchParams();
    const categoriaId = params.get("categoria") ? Number(params.get("categoria")) : null;
    const busqueda = params.get("q") ?? "";
    const orden = params.get("orden") ?? "menu";

    const cambiar = useCallback(
        (cambios) => {
            const siguiente = new URLSearchParams(params);
            Object.entries(cambios).forEach(([clave, valor]) =>
                valor ? siguiente.set(clave, String(valor)) : siguiente.delete(clave)
            );
            setParams(siguiente, { replace: true });
        },
        [params, setParams]
    );

    const limpiar = useCallback(() => setParams({}, { replace: true }), [setParams]);

    return {
        categoriaId,
        busqueda,
        orden,
        cambiar,
        limpiar,
        hayFiltros: Boolean(categoriaId || busqueda || orden !== "menu")
    };
};

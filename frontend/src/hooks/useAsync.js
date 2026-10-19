import { useCallback, useEffect, useState } from "react";

// Ejecuta una función asíncrona y expone { datos, error, cargando, recargar }.
// La función recibe un AbortSignal para cancelar la petición si el componente se desmonta.
export const useAsync = (funcion, dependencias = []) => {
    const [estado, setEstado] = useState({ datos: null, error: null, cargando: true });
    const [version, setVersion] = useState(0);

    useEffect(() => {
        const controlador = new AbortController();
        setEstado((anterior) => ({ ...anterior, error: null, cargando: true }));

        funcion(controlador.signal)
            .then((datos) => {
                if (!controlador.signal.aborted) setEstado({ datos, error: null, cargando: false });
            })
            .catch((error) => {
                if (controlador.signal.aborted || error.name === "AbortError") return;
                setEstado({ datos: null, error, cargando: false });
            });

        return () => controlador.abort();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [...dependencias, version]);

    const recargar = useCallback(() => setVersion((actual) => actual + 1), []);
    return { ...estado, recargar };
};

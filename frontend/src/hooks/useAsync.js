import { useCallback, useEffect, useRef, useState } from "react";

// Ejecuta una función asíncrona y expone { datos, error, cargando, actualizando, recargar }.
// `cargando` es solo la primera carga (o la de otros parámetros); si se recarga con datos ya a la vista,
// los datos se conservan y `actualizando` pasa a true, para que la pantalla no parpadee.
// La función recibe un AbortSignal para cancelar la petición si el componente se desmonta.
export const useAsync = (funcion, dependencias = []) => {
    const [estado, setEstado] = useState({ datos: null, error: null, cargando: true, actualizando: false });
    const [version, setVersion] = useState(0);
    const esRecarga = useRef(false);

    useEffect(() => {
        const controlador = new AbortController();
        const recarga = esRecarga.current;
        esRecarga.current = false;
        setEstado((anterior) =>
            recarga && anterior.datos !== null
                ? { ...anterior, error: null, actualizando: true }
                : { datos: null, error: null, cargando: true, actualizando: false }
        );

        funcion(controlador.signal)
            .then((datos) => {
                if (!controlador.signal.aborted)
                    setEstado({ datos, error: null, cargando: false, actualizando: false });
            })
            .catch((error) => {
                if (controlador.signal.aborted || error.name === "AbortError") return;
                setEstado((anterior) =>
                    recarga && anterior.datos !== null
                        ? { ...anterior, actualizando: false }
                        : { datos: null, error, cargando: false, actualizando: false }
                );
            });

        return () => controlador.abort();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [...dependencias, version]);

    const recargar = useCallback(() => {
        esRecarga.current = true;
        setVersion((actual) => actual + 1);
    }, []);
    return { ...estado, recargar };
};

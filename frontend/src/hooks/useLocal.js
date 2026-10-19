import { useEffect, useState } from "react";
import { obtenerLocal } from "../services/localService";

// Los datos del local se piden una sola vez y se comparten entre el pie, el inicio y el resto.
let promesa = null;

const cargarLocal = () => {
    if (!promesa) {
        promesa = obtenerLocal().catch((error) => {
            promesa = null;
            throw error;
        });
    }
    return promesa;
};

export const useLocal = () => {
    const [estado, setEstado] = useState({ local: null, error: null, cargando: true });

    useEffect(() => {
        let activo = true;
        cargarLocal()
            .then((local) => activo && setEstado({ local, error: null, cargando: false }))
            .catch((error) => activo && setEstado({ local: null, error, cargando: false }));
        return () => {
            activo = false;
        };
    }, []);

    return estado;
};

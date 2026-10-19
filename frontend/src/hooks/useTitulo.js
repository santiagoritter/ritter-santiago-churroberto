import { useEffect } from "react";

const BASE = "Churroberto";

export const useTitulo = (titulo) => {
    useEffect(() => {
        document.title = titulo ? `${titulo} | ${BASE}` : `${BASE}, churros hechos a la vista`;
    }, [titulo]);
};

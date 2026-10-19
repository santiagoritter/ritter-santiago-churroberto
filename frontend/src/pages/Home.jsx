import { lazy, Suspense, useMemo, useState } from "react";
import Cierre from "../components/sections/Cierre";
import Cintas from "../components/sections/Cintas";
import ComoSeHace from "../components/sections/ComoSeHace";
import Hero from "../components/sections/Hero";
import Manifiesto from "../components/sections/Manifiesto";
import MenuDestacado from "../components/sections/MenuDestacado";
import Resenas from "../components/sections/Resenas";
import SeccionLocal from "../components/sections/SeccionLocal";
import { useLocal } from "../hooks/useLocal";
import { useRefrescarScroll } from "../hooks/useRefrescarScroll";
import { useTitulo } from "../hooks/useTitulo";
import { hayWebGL } from "../utils/motion";

// El 3D pesa bastante: se baja aparte para que el texto aparezca primero.
const ChurroCanvas = lazy(() => import("../components/churro3d/ChurroCanvas"));

export default function Home() {
    useTitulo();
    useRefrescarScroll();
    const { local, error } = useLocal();
    const soportaWebGL = useMemo(() => hayWebGL(), []);
    const [contextoPerdido, setContextoPerdido] = useState(false);
    const conWebGL = soportaWebGL && !contextoPerdido;

    return (
        <div className="home">
            {conWebGL && (
                <Suspense fallback={null}>
                    <ChurroCanvas alPerderContexto={() => setContextoPerdido(true)} />
                </Suspense>
            )}
            <Hero local={local} sinWebGL={!conWebGL} />
            <Manifiesto />
            <Cintas />
            <ComoSeHace />
            <MenuDestacado />
            <Resenas />
            <SeccionLocal local={local} error={error} />
            <Cierre />
        </div>
    );
}

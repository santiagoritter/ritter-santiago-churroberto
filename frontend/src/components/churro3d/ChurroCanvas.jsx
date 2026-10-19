import { Canvas, useThree } from "@react-three/fiber";
import { useEffect, useState } from "react";
import { Environment, Lightformer, PerformanceMonitor } from "@react-three/drei";
import { useEsMovil, useMenosMovimiento } from "../../hooks/useMediaQuery";
import Churro from "./Churro";

// Si el navegador pierde el contexto de WebGL, se avisa para mostrar el dibujo 2D en su lugar.
function VigilanteDeContexto({ alPerder }) {
    const gl = useThree((estado) => estado.gl);

    useEffect(() => {
        const lienzo = gl.domElement;
        const alPerderContexto = (evento) => {
            evento.preventDefault();
            alPerder?.();
        };
        lienzo.addEventListener("webglcontextlost", alPerderContexto);
        return () => lienzo.removeEventListener("webglcontextlost", alPerderContexto);
    }, [gl, alPerder]);

    return null;
}

// Un único lienzo fijo detrás del contenido. Es decorativo: todo lo que dice ya está escrito en el HTML.
export default function ChurroCanvas({ alPerderContexto }) {
    const esMovil = useEsMovil();
    const menosMovimiento = useMenosMovimiento();
    // Resolución del lienzo: arranca alta y baja sola si el equipo no mantiene los cuadros por segundo.
    const maxima = Math.min(esMovil ? 1.5 : 1.75, window.devicePixelRatio || 1);
    const [resolucion, setResolucion] = useState(maxima);

    return (
        <div className="churro-lienzo" aria-hidden="true">
            <Canvas
                flat
                dpr={resolucion}
                camera={{ position: [0, 0, 7.5], fov: 32 }}
                gl={{ antialias: true, alpha: true, stencil: true, powerPreference: "default" }}
                onCreated={({ gl }) => {
                    gl.localClippingEnabled = true;
                }}
            >
                <PerformanceMonitor
                    flipflops={3}
                    onDecline={() => setResolucion((actual) => Math.max(1, actual - 0.35))}
                    onIncline={() => setResolucion((actual) => Math.min(maxima, actual + 0.25))}
                    onFallback={() => setResolucion(1)}
                />
                <VigilanteDeContexto alPerder={alPerderContexto} />
                <ambientLight intensity={0.75} />
                <directionalLight position={[3, 4, 5]} intensity={2.4} color="#fff1d4" />
                <directionalLight position={[-4, -1.5, -3]} intensity={1.6} color="#9fdcff" />
                <Environment resolution={256} frames={1}>
                    <Lightformer form="rect" intensity={3} position={[-3, 3, 4]} scale={[7, 3, 1]} color="#fff4dc" />
                    <Lightformer form="rect" intensity={2} position={[4, -2, 3]} scale={[5, 2, 1]} color="#ffd9a0" />
                    <Lightformer form="ring" intensity={2} position={[0, 4, -3]} scale={4} color="#bfe8ff" />
                </Environment>
                <Churro esMovil={esMovil} menosMovimiento={menosMovimiento} />
            </Canvas>
        </div>
    );
}

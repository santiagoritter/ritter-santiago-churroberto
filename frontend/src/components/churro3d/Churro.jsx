import { useFrame, useThree } from "@react-three/fiber";
import { useEffect, useLayoutEffect, useMemo, useRef } from "react";
import * as THREE from "three";
import { posicionScroll } from "../../utils/smoothScroll";
import { limitar } from "../../utils/format";
import { calcularAzucar, crearContorno, crearGeometriaChurro, crearNucleoDeRelleno } from "./churroGeometria";
import { crearTexturaMasa } from "./churroTextura";
import { estadoChurro, obtenerPose } from "./poses";

const VUELTA = Math.PI * 2;
const RADIANES_POR_PIXEL = 0.0042;
const PROPIEDADES = ["x", "y", "escala", "yaw", "pitch", "inclinacion"];

const amortiguar = THREE.MathUtils.damp;

export default function Churro({ esMovil, menosMovimiento }) {
    const { viewport } = useThree();
    const externo = useRef(null);
    const interno = useRef(null);
    const azucar = useRef(null);

    // Plano de corte en coordenadas del grupo externo: queda quieto mientras el churro rueda por dentro.
    const planoLocal = useMemo(() => new THREE.Plane(new THREE.Vector3(0, 0, -1), 1.2), []);
    const planoMundo = useMemo(() => new THREE.Plane(), []);
    const planos = useMemo(() => [planoMundo], [planoMundo]);

    const actual = useRef({ ...obtenerPose("hero", esMovil), roll: 0, corte: 0 });

    const geometrias = useMemo(() => {
        return {
            cuerpo: crearGeometriaChurro(),
            contorno: crearContorno(),
            nucleo: crearNucleoDeRelleno(),
            grano: new THREE.IcosahedronGeometry(1, 0)
        };
    }, []);

    const materiales = useMemo(() => {
        const textura = crearTexturaMasa();
        return {
            masa: new THREE.MeshStandardMaterial({
                map: textura,
                bumpMap: textura,
                bumpScale: 0.8,
                roughness: 0.62,
                metalness: 0,
                side: THREE.DoubleSide,
                clippingPlanes: planos
            }),
            contorno: new THREE.MeshBasicMaterial({ color: "#ffffff", side: THREE.BackSide, clippingPlanes: planos }),
            relleno: new THREE.MeshPhysicalMaterial({
                color: "#c57a1e",
                roughness: 0.28,
                clearcoat: 1,
                clearcoatRoughness: 0.2,
                side: THREE.DoubleSide,
                clippingPlanes: planos
            }),
            azucar: new THREE.MeshStandardMaterial({ color: "#fffaf0", roughness: 0.35, clippingPlanes: planos })
        };
    }, [planos]);

    const granos = useMemo(() => calcularAzucar(), []);

    useLayoutEffect(() => {
        const malla = azucar.current;
        const matriz = new THREE.Matrix4();
        const rotacion = new THREE.Euler();
        granos.forEach((grano, i) => {
            rotacion.set(grano.giro, grano.giro * 2, 0);
            matriz.compose(
                grano.posicion,
                new THREE.Quaternion().setFromEuler(rotacion),
                new THREE.Vector3(grano.escala, grano.escala * 0.8, grano.escala)
            );
            malla.setMatrixAt(i, matriz);
        });
        malla.instanceMatrix.needsUpdate = true;
    }, [granos]);

    useEffect(
        () => () => {
            Object.values(geometrias).forEach((geometria) => geometria.dispose());
            Object.values(materiales).forEach((material) => material.dispose());
            materiales.masa.map?.dispose();
        },
        [geometrias, materiales]
    );

    useFrame((estado, delta) => {
        const dt = Math.min(delta, 0.05);
        const pose = obtenerPose(estadoChurro.pose, esMovil);
        const rapidez = menosMovimiento ? 30 : 3.4;
        const ahora = estado.clock.elapsedTime;

        PROPIEDADES.forEach((propiedad) => {
            actual.current[propiedad] = amortiguar(actual.current[propiedad], pose[propiedad], rapidez, dt);
        });

        // Giro sobre su eje largo: sigue al scroll. En "Cómo se hace" se frena en un múltiplo de vuelta para mostrar el corte de frente.
        const rollObjetivo = pose.bloquearRoll
            ? Math.round(actual.current.roll / VUELTA) * VUELTA
            : menosMovimiento
              ? 0.4
              : posicionScroll() * RADIANES_POR_PIXEL;
        actual.current.roll = amortiguar(actual.current.roll, rollObjetivo, pose.bloquearRoll ? 3.5 : 5, dt);

        actual.current.corte = amortiguar(actual.current.corte, estadoChurro.corte, 4, dt);

        const ajuste = Math.min(1, viewport.width / 4.4);
        const flotar = menosMovimiento ? 0 : Math.sin(ahora * 1.3) * 0.05;
        const puntero = menosMovimiento ? { x: 0, y: 0 } : estado.pointer;

        const grupo = externo.current;
        // Cuando la pose lo "esconde" (escala casi cero) no se dibuja nada, ni siquiera el borde blanco.
        grupo.visible = actual.current.escala > 0.03;
        grupo.position.set(
            (actual.current.x * viewport.width) / 2,
            (actual.current.y * viewport.height) / 2 + flotar,
            0
        );
        grupo.scale.setScalar(ajuste * actual.current.escala);
        grupo.rotation.set(
            actual.current.pitch - puntero.y * 0.12,
            actual.current.yaw + puntero.x * 0.28,
            actual.current.inclinacion
        );
        interno.current.rotation.x = actual.current.roll;

        // Corte longitudinal: la mitad de adelante desaparece y se ve el relleno por dentro.
        const avance = limitar(actual.current.corte, 0, 1);
        planoLocal.constant = THREE.MathUtils.lerp(1.2, 0.02, avance * avance * (3 - 2 * avance));
        grupo.updateMatrixWorld();
        planoMundo.copy(planoLocal).applyMatrix4(grupo.matrixWorld);
    });

    return (
        <group ref={externo}>
            <group ref={interno}>
                <mesh geometry={geometrias.cuerpo} material={materiales.masa} />
                <mesh geometry={geometrias.contorno} material={materiales.contorno} />
                <mesh geometry={geometrias.nucleo} material={materiales.relleno} />
                <instancedMesh ref={azucar} args={[geometrias.grano, materiales.azucar, granos.length]} />
            </group>
        </group>
    );
}

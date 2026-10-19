import { useFrame, useThree } from "@react-three/fiber";
import { useEffect, useLayoutEffect, useMemo, useRef } from "react";
import * as THREE from "three";
import { limitar } from "../../utils/format";
import { posicionScroll } from "../../utils/smoothScroll";
import { calcularAzucar, crearGeometriaChurro, crearGeometriaContorno, crearNucleoDeRelleno } from "./churroGeometria";
import { crearMaterialContorno, marcarSilueta } from "./materialContorno";
import { crearTexturaMasa } from "./churroTextura";
import { estadoChurro, obtenerPose } from "./poses";

const VUELTA = Math.PI * 2;
const RADIANES_POR_PIXEL = 0.0042;
const PROPIEDADES = ["x", "y", "escala", "yaw", "pitch", "inclinacion"];
const GROSOR_CONTORNO_PX = 11;
// Máxima velocidad de giro sobre su eje: poco más de una vuelta por segundo, por rápido que se scrollee.
const VELOCIDAD_MAXIMA_GIRO = 7;
const MARGEN_CORTE_CONTORNO = 0.07;

const amortiguar = THREE.MathUtils.damp;

export default function Churro({ esMovil, menosMovimiento }) {
    const viewport = useThree((estado) => estado.viewport);
    const tamano = useThree((estado) => estado.size);
    const gl = useThree((estado) => estado.gl);
    const externo = useRef(null);
    const interno = useRef(null);
    const azucar = useRef(null);

    // Plano de corte en coordenadas del grupo externo: queda quieto mientras el churro rueda por dentro.
    const planoLocal = useMemo(() => new THREE.Plane(new THREE.Vector3(0, 0, -1), 1.2), []);
    const planoMundo = useMemo(() => new THREE.Plane(), []);
    const planos = useMemo(() => [planoMundo], [planoMundo]);
    // El borde de sticker se corta un poco más lejos que el churro: así rodea también el filo del corte.
    const planoContornoMundo = useMemo(() => new THREE.Plane(), []);
    const planosContorno = useMemo(() => [planoContornoMundo], [planoContornoMundo]);

    // Entra desde cero y girando: arranca chico y con varias vueltas de atraso que se van deshaciendo.
    const actual = useRef({
        ...obtenerPose("hero", esMovil),
        escala: menosMovimiento ? obtenerPose("hero", esMovil).escala : 0,
        roll: menosMovimiento ? 0 : -9,
        corte: 0
    });
    const puntero = useRef({ x: 0, y: 0, objetivoX: 0, objetivoY: 0 });
    // Reacciones: una vuelta extra con salto (impulso) y un poco de entusiasmo sobre los botones importantes.
    const giroExtra = useRef({ actual: 0, objetivo: 0 });
    const ultimoImpulso = useRef(estadoChurro.impulso);
    const pulso = useRef(0);

    const geometrias = useMemo(
        () => ({
            cuerpo: crearGeometriaChurro(),
            contorno: crearGeometriaContorno(),
            nucleo: crearNucleoDeRelleno(),
            grano: new THREE.IcosahedronGeometry(1, 1)
        }),
        []
    );

    const materiales = useMemo(() => {
        const textura = crearTexturaMasa();
        return {
            masa: marcarSilueta(
                new THREE.MeshStandardMaterial({
                    map: textura,
                    bumpMap: textura,
                    bumpScale: 0.6,
                    roughness: 0.55,
                    metalness: 0,
                    side: THREE.DoubleSide,
                    clippingPlanes: planos
                })
            ),
            relleno: marcarSilueta(
                new THREE.MeshPhysicalMaterial({
                    color: "#c57a1e",
                    roughness: 0.28,
                    clearcoat: 1,
                    clearcoatRoughness: 0.2,
                    side: THREE.DoubleSide,
                    clippingPlanes: planos
                })
            ),
            azucar: marcarSilueta(
                new THREE.MeshStandardMaterial({ color: "#fffaf0", roughness: 0.35, clippingPlanes: planos })
            ),
            contorno: crearMaterialContorno(planosContorno)
        };
    }, [planos, planosContorno]);

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
        malla.computeBoundingSphere();
    }, [granos]);

    // El grosor del borde se mide en píxeles reales del lienzo: se actualiza si cambia el tamaño o la densidad.
    useEffect(() => {
        const tamanoReal = gl.getDrawingBufferSize(new THREE.Vector2());
        materiales.contorno.uniforms.uTamano.value.copy(tamanoReal);
        materiales.contorno.uniforms.uGrosor.value = GROSOR_CONTORNO_PX * viewport.dpr;
    }, [gl, materiales, tamano, viewport.dpr]);

    // El puntero se sigue desde la ventana: el lienzo no recibe eventos porque va detrás del contenido.
    useEffect(() => {
        if (menosMovimiento) return undefined;
        const alMover = (evento) => {
            puntero.current.objetivoX = (evento.clientX / window.innerWidth) * 2 - 1;
            puntero.current.objetivoY = -((evento.clientY / window.innerHeight) * 2 - 1);
        };
        window.addEventListener("pointermove", alMover, { passive: true });
        return () => window.removeEventListener("pointermove", alMover);
    }, [menosMovimiento]);

    // Pasar el mouse (o el foco) por un botón marcado con data-churro lo pone contento.
    useEffect(() => {
        const evaluar = (evento) => {
            estadoChurro.entusiasmo = evento.target.closest?.("[data-churro]") ? 1 : 0;
        };
        const apagar = (evento) => {
            if (!evento.relatedTarget?.closest?.("[data-churro]")) estadoChurro.entusiasmo = 0;
        };
        document.addEventListener("pointerover", evaluar);
        document.addEventListener("focusin", evaluar);
        document.addEventListener("pointerout", apagar);
        document.addEventListener("focusout", apagar);
        return () => {
            document.removeEventListener("pointerover", evaluar);
            document.removeEventListener("focusin", evaluar);
            document.removeEventListener("pointerout", apagar);
            document.removeEventListener("focusout", apagar);
            estadoChurro.entusiasmo = 0;
        };
    }, []);

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
        const grupo = externo.current;

        // Mientras la pantalla de carga tapa la página, el churro espera escondido y entra cuando se levanta.
        if (document.documentElement.dataset.precarga === "activa") {
            grupo.visible = false;
            return;
        }

        PROPIEDADES.forEach((propiedad) => {
            actual.current[propiedad] = amortiguar(actual.current[propiedad], pose[propiedad], rapidez, dt);
        });

        // Giro sobre su eje largo: sigue al scroll. En "Cómo se hace" se frena en un múltiplo de vuelta para mostrar el corte de frente.
        const rollObjetivo = pose.bloquearRoll
            ? Math.round(actual.current.roll / VUELTA) * VUELTA
            : menosMovimiento
              ? 0.4
              : posicionScroll() * RADIANES_POR_PIXEL;
        const rollSuavizado = amortiguar(actual.current.roll, rollObjetivo, pose.bloquearRoll ? 3.5 : 5, dt);
        const pasoMaximo = VELOCIDAD_MAXIMA_GIRO * dt;
        actual.current.roll += limitar(rollSuavizado - actual.current.roll, -pasoMaximo, pasoMaximo);

        actual.current.corte = amortiguar(actual.current.corte, estadoChurro.corte, 4, dt);

        // La inclinación hacia el mouse se suaviza para que nunca dé tirones.
        puntero.current.x = amortiguar(puntero.current.x, puntero.current.objetivoX, 4, dt);
        puntero.current.y = amortiguar(puntero.current.y, puntero.current.objetivoY, 4, dt);

        if (estadoChurro.impulso !== ultimoImpulso.current) {
            ultimoImpulso.current = estadoChurro.impulso;
            if (!menosMovimiento) {
                giroExtra.current.objetivo += VUELTA;
                pulso.current = 1;
            }
        }
        const faltaGirar =
            amortiguar(giroExtra.current.actual, giroExtra.current.objetivo, 3.2, dt) - giroExtra.current.actual;
        const pasoExtra = VELOCIDAD_MAXIMA_GIRO * 1.6 * dt;
        giroExtra.current.actual += limitar(faltaGirar, -pasoExtra, pasoExtra);
        pulso.current = amortiguar(pulso.current, 0, 5, dt);
        actual.current.entusiasmo = amortiguar(actual.current.entusiasmo ?? 0, estadoChurro.entusiasmo, 6, dt);
        const animo = menosMovimiento ? 0 : actual.current.entusiasmo;

        const ajuste = Math.min(1, viewport.width / 4.4);
        const flotar = menosMovimiento ? 0 : Math.sin(ahora * 1.3) * 0.05;

        // Cuando la pose lo "esconde" (escala casi cero) no se dibuja nada, ni siquiera el borde blanco.
        grupo.visible = actual.current.escala > 0.03;
        grupo.position.set(
            (actual.current.x * viewport.width) / 2,
            (actual.current.y * viewport.height) / 2 + flotar,
            0
        );
        grupo.scale.setScalar(ajuste * actual.current.escala * (1 + 0.1 * pulso.current + 0.07 * animo));
        grupo.rotation.set(
            actual.current.pitch - puntero.current.y * 0.12,
            actual.current.yaw + puntero.current.x * 0.28,
            actual.current.inclinacion + Math.sin(ahora * 9) * 0.04 * animo
        );
        interno.current.rotation.x = actual.current.roll + giroExtra.current.actual;

        // Corte longitudinal: la mitad de adelante desaparece y se ve el relleno por dentro.
        const avance = limitar(actual.current.corte, 0, 1);
        planoLocal.constant = THREE.MathUtils.lerp(1.2, 0.02, avance * avance * (3 - 2 * avance));
        grupo.updateMatrixWorld();
        planoMundo.copy(planoLocal).applyMatrix4(grupo.matrixWorld);
        planoLocal.constant += MARGEN_CORTE_CONTORNO;
        planoContornoMundo.copy(planoLocal).applyMatrix4(grupo.matrixWorld);
        planoLocal.constant -= MARGEN_CORTE_CONTORNO;
    });

    return (
        <group ref={externo} visible={false}>
            <group ref={interno}>
                <mesh geometry={geometrias.cuerpo} material={materiales.masa} />
                <mesh
                    geometry={geometrias.contorno}
                    material={materiales.contorno}
                    renderOrder={10}
                    frustumCulled={false}
                />
                <mesh geometry={geometrias.nucleo} material={materiales.relleno} />
                <instancedMesh
                    ref={azucar}
                    args={[geometrias.grano, materiales.azucar, granos.length]}
                    frustumCulled={false}
                />
            </group>
        </group>
    );
}

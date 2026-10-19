import * as THREE from "three";

// Medidas del churro (unidades de escena). Es más ancho que uno real: es un personaje.
export const PUNTAS = 10;
const RADIO = 0.5;
const PROFUNDIDAD_SURCO = 0.17;
const LARGO = 3.4;
const ARCO = 0.3;
const SEGMENTOS = 120;
const PASOS_POR_PUNTA = 10;
const COLUMNAS = PUNTAS * PASOS_POR_PUNTA;
const HUNDIDO_PUNTA = 0.1;
export const RADIO_RELLENO = 0.17;

const suavizar = (borde0, borde1, x) => {
    const t = Math.min(1, Math.max(0, (x - borde0) / (borde1 - borde0)));
    return t * t * (3 - 2 * t);
};

// Números repetibles: el azúcar y la textura se ven igual en cada carga.
export const aleatorioFijo = (semilla) => {
    let estado = semilla >>> 0;
    return () => {
        estado = (estado + 0x6d2b79f5) >>> 0;
        let t = estado;
        t = Math.imul(t ^ (t >>> 15), t | 1);
        t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
        return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
};

export const crearCurva = () =>
    new THREE.CatmullRomCurve3(
        [
            new THREE.Vector3(-LARGO / 2, -ARCO * 0.35, 0),
            new THREE.Vector3(-LARGO / 6, ARCO * 0.5, 0),
            new THREE.Vector3(LARGO / 6, ARCO * 0.5, 0),
            new THREE.Vector3(LARGO / 2, -ARCO * 0.35, 0)
        ],
        false,
        "centripetal"
    );

// Perfil de estrella redondeada: crestas anchas y surcos angostos.
const radioDelPerfil = (theta, radio, profundidad) => {
    const cresta = 0.5 + 0.5 * Math.cos(PUNTAS * theta);
    return radio * (1 - profundidad * (1 - Math.pow(cresta, 0.55)));
};

const marcoEn = (curva, t) => {
    const P = curva.getPointAt(t);
    const T = curva.getTangentAt(t).normalize();
    const N = new THREE.Vector3(-T.y, T.x, 0).normalize();
    const B = new THREE.Vector3(0, 0, 1);
    return { P, T, N, B };
};

const puntoDelAnillo = (marco, theta, factor = 1) => {
    const radio = radioDelPerfil(theta, RADIO, PROFUNDIDAD_SURCO) * factor;
    return marco.P.clone()
        .addScaledVector(marco.N, radio * Math.cos(theta))
        .addScaledVector(marco.B, radio * Math.sin(theta));
};

export function crearGeometriaChurro() {
    const curva = crearCurva();
    const marcos = Array.from({ length: SEGMENTOS + 1 }, (_, i) => marcoEn(curva, i / SEGMENTOS));

    const posiciones = [];
    const normales = [];
    const uvs = [];
    const indices = [];

    // Cuerpo: anillos de estrella a lo largo de la curva. La última columna repite la primera para que la textura cierre.
    const anillos = marcos.map((marco, i) => {
        const t = i / SEGMENTOS;
        const bisel = 0.88 + 0.12 * suavizar(0, 0.035, Math.min(t, 1 - t));
        return Array.from({ length: COLUMNAS + 1 }, (_, j) =>
            puntoDelAnillo(marco, (j / COLUMNAS) * Math.PI * 2, bisel)
        );
    });

    const indiceDe = (i, j) => i * (COLUMNAS + 1) + j;

    anillos.forEach((anillo, i) => {
        anillo.forEach((punto, j) => {
            posiciones.push(punto.x, punto.y, punto.z);
            uvs.push(j / COLUMNAS, (i / SEGMENTOS) * 2);

            // Normal por diferencias finitas, con vuelta completa en la unión para que no se vea la costura.
            const anterior = anillo[(j - 1 + COLUMNAS) % COLUMNAS];
            const siguiente = anillo[(j + 1) % COLUMNAS];
            const arriba = anillos[Math.min(SEGMENTOS, i + 1)][j];
            const abajo = anillos[Math.max(0, i - 1)][j];
            const normal = new THREE.Vector3()
                .crossVectors(siguiente.clone().sub(anterior), arriba.clone().sub(abajo))
                .normalize();
            const haciaAfuera = punto.clone().sub(marcos[i].P);
            if (normal.dot(haciaAfuera) < 0) normal.negate();
            normales.push(normal.x, normal.y, normal.z);
        });
    });

    // Se prueba el sentido de un triángulo y se usa el mismo en todos.
    const a = anillos[1][0];
    const b = anillos[1][1];
    const c = anillos[2][0];
    const caraPrueba = new THREE.Vector3().crossVectors(b.clone().sub(a), c.clone().sub(a));
    const sentido = caraPrueba.dot(a.clone().sub(marcos[1].P)) >= 0;

    for (let i = 0; i < SEGMENTOS; i += 1) {
        for (let j = 0; j < COLUMNAS; j += 1) {
            const p00 = indiceDe(i, j);
            const p01 = indiceDe(i, j + 1);
            const p10 = indiceDe(i + 1, j);
            const p11 = indiceDe(i + 1, j + 1);
            if (sentido) indices.push(p00, p01, p10, p01, p11, p10);
            else indices.push(p00, p10, p01, p01, p10, p11);
        }
    }

    // Tapas: la cara en estrella, con un hundimiento al centro.
    [0, 1].forEach((punta) => {
        const marco = marcos[punta === 0 ? 0 : SEGMENTOS];
        const haciaAfuera = marco.T.clone().multiplyScalar(punta === 0 ? -1 : 1);
        const anillo = anillos[punta === 0 ? 0 : SEGMENTOS];
        const base = posiciones.length / 3;
        const centro = marco.P.clone().addScaledVector(haciaAfuera, -HUNDIDO_PUNTA);

        posiciones.push(centro.x, centro.y, centro.z);
        normales.push(haciaAfuera.x, haciaAfuera.y, haciaAfuera.z);
        uvs.push(0.5, 0.5);

        for (let j = 0; j < COLUMNAS; j += 1) {
            posiciones.push(anillo[j].x, anillo[j].y, anillo[j].z);
            normales.push(haciaAfuera.x, haciaAfuera.y, haciaAfuera.z);
            // Todo el corte toma el tono claro del valle de la textura: masa recién cortada.
            uvs.push(0.5, 0.5);
        }

        for (let j = 0; j < COLUMNAS; j += 1) {
            const uno = base + 1 + j;
            const dos = base + 1 + ((j + 1) % COLUMNAS);
            const cara = new THREE.Vector3().crossVectors(
                anillo[(j + 1) % COLUMNAS].clone().sub(anillo[j]),
                centro.clone().sub(anillo[j])
            );
            if (cara.dot(haciaAfuera) >= 0) indices.push(uno, dos, base);
            else indices.push(dos, uno, base);
        }
    });

    const geometria = new THREE.BufferGeometry();
    geometria.setAttribute("position", new THREE.Float32BufferAttribute(posiciones, 3));
    geometria.setAttribute("normal", new THREE.Float32BufferAttribute(normales, 3));
    geometria.setAttribute("uv", new THREE.Float32BufferAttribute(uvs, 2));
    geometria.setIndex(indices);
    geometria.computeBoundingSphere();
    return geometria;
}

// Copia del churro para el borde de sticker. En los extremos la pared y la tapa comparten una normal intermedia,
// así al empujar el borde hacia afuera las puntas quedan redondeadas y sin huecos.
export function crearGeometriaContorno() {
    const geometria = crearGeometriaChurro();
    const normales = geometria.attributes.normal;
    const curva = crearCurva();
    const vertices = (SEGMENTOS + 1) * (COLUMNAS + 1);
    const normal = new THREE.Vector3();

    [
        { t: 0, signo: -1, anilloPared: 0, baseTapa: vertices },
        { t: 1, signo: 1, anilloPared: SEGMENTOS, baseTapa: vertices + COLUMNAS + 1 }
    ].forEach(({ t, signo, anilloPared, baseTapa }) => {
        const eje = curva.getTangentAt(t).normalize().multiplyScalar(signo);
        for (let j = 0; j <= COLUMNAS; j += 1) {
            const indicePared = anilloPared * (COLUMNAS + 1) + j;
            normal.fromBufferAttribute(normales, indicePared).add(eje).normalize();
            normales.setXYZ(indicePared, normal.x, normal.y, normal.z);
            if (j < COLUMNAS) normales.setXYZ(baseTapa + 1 + j, normal.x, normal.y, normal.z);
        }
        normales.setXYZ(baseTapa, eje.x, eje.y, eje.z);
    });
    normales.needsUpdate = true;
    return geometria;
}

export const crearNucleoDeRelleno = () => new THREE.TubeGeometry(crearCurva(), 110, RADIO_RELLENO, 24, false);

// Granitos de azúcar sobre las crestas.
export function calcularAzucar(cantidad = 520) {
    const curva = crearCurva();
    const azar = aleatorioFijo(2024);
    return Array.from({ length: cantidad }, () => {
        const t = 0.02 + azar() * 0.96;
        const marco = marcoEn(curva, t);
        const theta = azar() * Math.PI * 2;
        const punto = puntoDelAnillo(marco, theta, 1.004);
        return { posicion: punto, escala: 0.011 + azar() * 0.013, giro: azar() * Math.PI };
    });
}

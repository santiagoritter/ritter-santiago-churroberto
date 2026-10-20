import * as THREE from "three";

// Medidas del churro (unidades de escena). Es más ancho que uno real: es un personaje.
export const PUNTAS = 10;
const RADIO = 0.5;
const PROFUNDIDAD_SURCO = 0.17;
// Cada punta se cierra con una cúpula redondeada que sobresale ALTURA_PUNTA más allá de la curva: el largo de la
// curva se acorta para que el churro entero siga midiendo lo mismo (3,4) que cuando las puntas eran planas.
const ALTURA_PUNTA = 0.24;
const LARGO = 3.4 - 2 * ALTURA_PUNTA;
const ARCO = 0.3 * (LARGO / 3.4);
const SEGMENTOS = 120;
const ANILLOS_PUNTA = 8;
const PASOS_POR_PUNTA = 10;
const COLUMNAS = PUNTAS * PASOS_POR_PUNTA;
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
    const anillosDelCuerpo = marcos.map((marco, i) => {
        const t = i / SEGMENTOS;
        const bisel = 0.88 + 0.12 * suavizar(0, 0.035, Math.min(t, 1 - t));
        return Array.from({ length: COLUMNAS + 1 }, (_, j) =>
            puntoDelAnillo(marco, (j / COLUMNAS) * Math.PI * 2, bisel)
        );
    });

    // Puntas: anillos cada vez más chicos y más adelantados, que se cierran en un punto. Siguen el perfil de estrella,
    // así los surcos se juntan hacia la punta y no hay tapa plana ni borde duro.
    const cupula = (punta) => {
        const marco = marcos[punta === 0 ? 0 : SEGMENTOS];
        const haciaAfuera = marco.T.clone().multiplyScalar(punta === 0 ? -1 : 1);
        const biselBase = 0.88;
        return Array.from({ length: ANILLOS_PUNTA }, (_, k) => {
            const angulo = ((k + 1) / ANILLOS_PUNTA) * (Math.PI / 2);
            const desplazamiento = haciaAfuera.clone().multiplyScalar(ALTURA_PUNTA * Math.sin(angulo));
            const anillo = Array.from({ length: COLUMNAS + 1 }, (_, j) =>
                puntoDelAnillo(marco, (j / COLUMNAS) * Math.PI * 2, biselBase * Math.cos(angulo)).add(desplazamiento)
            );
            return { anillo, centro: marco.P.clone().add(desplazamiento), haciaAfuera, v: punta === 0 ? 0 : 2 };
        });
    };
    const puntaInicio = cupula(0).reverse();
    const puntaFin = cupula(1);

    // Todos los anillos, de punta a punta: cada uno con su centro (para orientar la normal hacia afuera).
    const anillos = [
        ...puntaInicio,
        ...anillosDelCuerpo.map((anillo, i) => ({ anillo, centro: marcos[i].P, v: (i / SEGMENTOS) * 2 })),
        ...puntaFin
    ];
    const ultimo = anillos.length - 1;
    const indiceDe = (i, j) => i * (COLUMNAS + 1) + j;

    anillos.forEach(({ anillo, centro, haciaAfuera, v }, i) => {
        // El último anillo de cada punta es un solo punto: su normal es el eje.
        const esPolo = i === 0 || i === ultimo;
        anillo.forEach((punto, j) => {
            posiciones.push(punto.x, punto.y, punto.z);
            uvs.push(j / COLUMNAS, v);

            if (esPolo) {
                normales.push(haciaAfuera.x, haciaAfuera.y, haciaAfuera.z);
                return;
            }
            // Normal por diferencias finitas, con vuelta completa en la unión para que no se vea la costura.
            const anterior = anillo[(j - 1 + COLUMNAS) % COLUMNAS];
            const siguiente = anillo[(j + 1) % COLUMNAS];
            const arriba = anillos[i + 1].anillo[j];
            const abajo = anillos[i - 1].anillo[j];
            const normal = new THREE.Vector3()
                .crossVectors(siguiente.clone().sub(anterior), arriba.clone().sub(abajo))
                .normalize();
            if (normal.dot(punto.clone().sub(centro)) < 0) normal.negate();
            normales.push(normal.x, normal.y, normal.z);
        });
    });

    // Se prueba el sentido de un triángulo del cuerpo y se usa el mismo en todos.
    const medio = ANILLOS_PUNTA + Math.floor(SEGMENTOS / 2);
    const a = anillos[medio].anillo[0];
    const b = anillos[medio].anillo[1];
    const c = anillos[medio + 1].anillo[0];
    const caraPrueba = new THREE.Vector3().crossVectors(b.clone().sub(a), c.clone().sub(a));
    const sentido = caraPrueba.dot(a.clone().sub(anillos[medio].centro)) >= 0;

    for (let i = 0; i < ultimo; i += 1) {
        for (let j = 0; j < COLUMNAS; j += 1) {
            const p00 = indiceDe(i, j);
            const p01 = indiceDe(i, j + 1);
            const p10 = indiceDe(i + 1, j);
            const p11 = indiceDe(i + 1, j + 1);
            if (sentido) indices.push(p00, p01, p10, p01, p11, p10);
            else indices.push(p00, p10, p01, p01, p10, p11);
        }
    }

    const geometria = new THREE.BufferGeometry();
    geometria.setAttribute("position", new THREE.Float32BufferAttribute(posiciones, 3));
    geometria.setAttribute("normal", new THREE.Float32BufferAttribute(normales, 3));
    geometria.setAttribute("uv", new THREE.Float32BufferAttribute(uvs, 2));
    geometria.setIndex(indices);
    geometria.computeBoundingSphere();
    return geometria;
}

// Copia del churro para el borde de sticker. Como las puntas son cúpulas sin aristas, las normales ya apuntan hacia
// afuera de forma continua y alcanza con la misma geometría.
export const crearGeometriaContorno = () => crearGeometriaChurro();

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

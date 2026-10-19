import * as THREE from "three";

// Borde de sticker en dos pasos con el buffer de stencil:
//  1. Todo lo que forma el churro (masa, relleno, azúcar) marca con 1 los píxeles que cubre.
//  2. El borde blanco es una copia del churro empujada hacia afuera, un número fijo de píxeles, y solo se dibuja
//     donde el stencil NO vale 1. Por eso nunca se mete en los surcos ni cambia de grosor con el ángulo.

export const marcarSilueta = (material) => {
    material.stencilWrite = true;
    material.stencilRef = 1;
    material.stencilFunc = THREE.AlwaysStencilFunc;
    material.stencilZPass = THREE.ReplaceStencilOp;
    return material;
};

export function crearMaterialContorno(planosDeCorte) {
    const material = new THREE.ShaderMaterial({
        uniforms: {
            uColor: { value: new THREE.Color("#ffffff") },
            uGrosor: { value: 12 },
            uTamano: { value: new THREE.Vector2(1, 1) }
        },
        vertexShader: /* glsl */ `
            #include <common>
            #include <clipping_planes_pars_vertex>
            uniform float uGrosor;
            uniform vec2 uTamano;
            void main() {
                #include <begin_vertex>
                #include <project_vertex>
                #include <clipping_planes_vertex>
                vec4 posicion = projectionMatrix * modelViewMatrix * vec4(transformed, 1.0);
                vec3 normalVista = normalize(normalMatrix * normal);
                // Si la normal apunta casi a la cámara, el desplazamiento se anula en lugar de normalizar un vector casi nulo.
                vec2 proyectada = (projectionMatrix * vec4(normalVista, 0.0)).xy;
                vec2 direccion = proyectada / max(length(proyectada), 0.35);
                posicion.xy += direccion * uGrosor / uTamano * posicion.w * 2.0;
                gl_Position = posicion;
            }
        `,
        fragmentShader: /* glsl */ `
            uniform vec3 uColor;
            #include <clipping_planes_pars_fragment>
            void main() {
                #include <clipping_planes_fragment>
                gl_FragColor = vec4(uColor, 1.0);
            }
        `,
        clipping: true,
        clippingPlanes: planosDeCorte,
        depthTest: false,
        depthWrite: false,
        stencilWrite: true,
        stencilRef: 1,
        stencilFunc: THREE.NotEqualStencilFunc,
        stencilFail: THREE.KeepStencilOp,
        stencilZFail: THREE.KeepStencilOp,
        stencilZPass: THREE.KeepStencilOp
    });
    return material;
}

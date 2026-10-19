// El almacenamiento del navegador puede fallar (modo privado, datos bloqueados): nunca debe romper la app.
const leer = (almacen, clave, porDefecto) => {
    try {
        const valor = almacen.getItem(clave);
        return valor === null ? porDefecto : JSON.parse(valor);
    } catch {
        return porDefecto;
    }
};

const guardar = (almacen, clave, valor) => {
    try {
        almacen.setItem(clave, JSON.stringify(valor));
    } catch {
        // Sin almacenamiento disponible: la app sigue funcionando sin recordar el dato.
    }
};

const borrar = (almacen, clave) => {
    try {
        almacen.removeItem(clave);
    } catch {
        // Nada que borrar.
    }
};

export const leerLocal = (clave, porDefecto = null) => leer(window.localStorage, clave, porDefecto);
export const guardarLocal = (clave, valor) => guardar(window.localStorage, clave, valor);
export const borrarLocal = (clave) => borrar(window.localStorage, clave);

export const leerSesion = (clave, porDefecto = null) => leer(window.sessionStorage, clave, porDefecto);
export const guardarSesion = (clave, valor) => guardar(window.sessionStorage, clave, valor);

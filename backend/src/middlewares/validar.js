import { parseId } from "../utils/validators.js";

// Reemplaza el body por la versión validada y limpia que devuelve el validador.
export const validar = (validador) => (req, res, next) => {
    req.body = validador(req.body);
    next();
};

// Se registra con router.param("id", paramId) y convierte el parámetro de la URL en número.
export const paramId = (req, res, next, valor, nombre) => {
    req.params[nombre] = parseId(valor);
    next();
};

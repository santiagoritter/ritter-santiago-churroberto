import { Messages } from "../enums/Messages.js";
import { ForbiddenError, UnauthorizedError } from "../exceptions/AppError.js";
import { verificarToken } from "../utils/token.js";

const PREFIJO = "Bearer ";

export const autenticar = (req, res, next) => {
    const encabezado = req.headers.authorization;
    if (!encabezado?.startsWith(PREFIJO)) {
        throw new UnauthorizedError(Messages.TOKEN_REQUIRED);
    }
    const payload = verificarToken(encabezado.slice(PREFIJO.length));
    req.usuario = { id: Number(payload.sub), rol: payload.rol };
    next();
};

export const requerirRol =
    (...roles) =>
    (req, res, next) => {
        if (!roles.includes(req.usuario.rol)) {
            throw new ForbiddenError(Messages.FORBIDDEN);
        }
        next();
    };

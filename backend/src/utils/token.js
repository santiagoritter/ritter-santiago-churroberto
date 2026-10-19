import jwt from "jsonwebtoken";
import { config } from "./config.js";
import { Messages } from "../enums/Messages.js";
import { UnauthorizedError } from "../exceptions/AppError.js";

export const firmarToken = (usuario) =>
    jwt.sign({ rol: usuario.rol }, config.jwtSecret, {
        subject: String(usuario.id),
        expiresIn: config.jwtExpiresIn
    });

export const verificarToken = (token) => {
    try {
        return jwt.verify(token, config.jwtSecret);
    } catch {
        throw new UnauthorizedError(Messages.TOKEN_INVALID);
    }
};

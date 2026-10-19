import rateLimit from "express-rate-limit";
import { TooManyRequestsError } from "../exceptions/AppError.js";
import { config } from "../utils/config.js";

const QUINCE_MINUTOS = 15 * 60 * 1000;

// Freno contra fuerza bruta en el registro y el inicio de sesión.
export const limitadorAuth = rateLimit({
    windowMs: QUINCE_MINUTOS,
    limit: 30,
    standardHeaders: "draft-8",
    legacyHeaders: false,
    skip: () => config.isTest,
    handler: (req, res, next) => next(new TooManyRequestsError())
});

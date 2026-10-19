import AppError from "../exceptions/AppError.js";
import { Messages } from "../enums/Messages.js";
import ApiResponse from "../responses/ApiResponse.js";

// Único lugar donde se arma la respuesta de error de toda la API.
export const errorHandler = (error, req, res, next) => {
    if (error instanceof AppError) {
        return ApiResponse.error(res, error.message, error.statusCode);
    }
    // JSON mal formado o demasiado grande: lo detecta express.json antes de llegar a la ruta.
    if (error.type === "entity.parse.failed" || error.type === "entity.too.large") {
        return ApiResponse.error(res, Messages.INVALID_DATA, 400);
    }
    console.error(error);
    return ApiResponse.error(res, Messages.INTERNAL_ERROR, 500);
};

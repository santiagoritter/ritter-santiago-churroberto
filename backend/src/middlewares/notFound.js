import { Messages } from "../enums/Messages.js";
import { NotFoundError } from "../exceptions/AppError.js";

export const notFound = (req, res, next) => {
    next(new NotFoundError(Messages.ROUTE_NOT_FOUND));
};

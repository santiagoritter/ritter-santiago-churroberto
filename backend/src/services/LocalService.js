import { Messages } from "../enums/Messages.js";
import { NotFoundError } from "../exceptions/AppError.js";
import LocalRepository from "../repositories/LocalRepository.js";

class LocalService {
    obtener() {
        const local = LocalRepository.obtener();
        if (!local) {
            throw new NotFoundError(Messages.LOCAL_NOT_FOUND);
        }
        return local;
    }
}

export default new LocalService();

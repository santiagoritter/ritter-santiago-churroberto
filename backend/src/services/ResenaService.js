import ResenaRepository from "../repositories/ResenaRepository.js";

class ResenaService {
    listar() {
        return ResenaRepository.findAll();
    }
}

export default new ResenaService();

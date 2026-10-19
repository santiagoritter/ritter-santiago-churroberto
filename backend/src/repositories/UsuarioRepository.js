import MemoryRepository from "./MemoryRepository.js";

class UsuarioRepository extends MemoryRepository {
    findByEmail(email) {
        return this.findOne((usuario) => usuario.email === email);
    }
}

export default new UsuarioRepository();

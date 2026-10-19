import MemoryRepository from "./MemoryRepository.js";

class LocalRepository extends MemoryRepository {
    // El sistema tiene un único local: se devuelve el primero que exista.
    obtener() {
        return this.findAll()[0] ?? null;
    }
}

export default new LocalRepository();

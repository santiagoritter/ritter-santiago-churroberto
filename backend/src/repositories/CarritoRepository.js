import MemoryRepository from "./MemoryRepository.js";

class CarritoRepository extends MemoryRepository {
    #nextItemId = 1;

    findByUsuarioId(usuarioId) {
        return this.findOne((carrito) => carrito.usuarioId === usuarioId);
    }

    nextItemId() {
        return this.#nextItemId++;
    }

    clear() {
        super.clear();
        this.#nextItemId = 1;
    }
}

export default new CarritoRepository();

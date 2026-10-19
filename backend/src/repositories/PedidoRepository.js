import MemoryRepository from "./MemoryRepository.js";

class PedidoRepository extends MemoryRepository {
    #nextItemId = 1;

    findByUsuarioId(usuarioId) {
        return this.findMany((pedido) => pedido.usuarioId === usuarioId);
    }

    nextItemId() {
        return this.#nextItemId++;
    }

    clear() {
        super.clear();
        this.#nextItemId = 1;
    }
}

export default new PedidoRepository();

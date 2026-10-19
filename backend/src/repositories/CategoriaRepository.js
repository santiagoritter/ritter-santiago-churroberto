import MemoryRepository from "./MemoryRepository.js";

const normalizar = (texto) => texto.trim().toLowerCase();

class CategoriaRepository extends MemoryRepository {
    findByNombre(nombre) {
        return this.findOne((categoria) => normalizar(categoria.nombre) === normalizar(nombre));
    }
}

export default new CategoriaRepository();

import MemoryRepository from "./MemoryRepository.js";

const normalizar = (texto) => texto.trim().toLowerCase();

class ProductoRepository extends MemoryRepository {
    findByNombre(nombre) {
        return this.findOne((producto) => normalizar(producto.nombre) === normalizar(nombre));
    }

    findByCategoria(categoriaId) {
        return this.findMany((producto) => producto.categoriaId === categoriaId);
    }
}

export default new ProductoRepository();

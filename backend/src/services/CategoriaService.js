import Categoria from "../models/Categoria.js";
import { Messages } from "../enums/Messages.js";
import { ConflictError, NotFoundError } from "../exceptions/AppError.js";
import CategoriaRepository from "../repositories/CategoriaRepository.js";
import ProductoRepository from "../repositories/ProductoRepository.js";

class CategoriaService {
    listar() {
        return CategoriaRepository.findAll();
    }

    obtener(id) {
        const categoria = CategoriaRepository.findById(id);
        if (!categoria) {
            throw new NotFoundError(Messages.CATEGORY_NOT_FOUND);
        }
        return categoria;
    }

    crear(datos) {
        if (CategoriaRepository.findByNombre(datos.nombre)) {
            throw new ConflictError(Messages.CATEGORY_DUPLICATED);
        }
        return CategoriaRepository.save(new Categoria(null, datos.nombre, datos.descripcion));
    }

    actualizar(id, datos) {
        this.obtener(id);
        const mismoNombre = CategoriaRepository.findByNombre(datos.nombre);
        if (mismoNombre && mismoNombre.id !== id) {
            throw new ConflictError(Messages.CATEGORY_DUPLICATED);
        }
        return CategoriaRepository.update(id, datos);
    }

    eliminar(id) {
        this.obtener(id);
        if (ProductoRepository.findByCategoria(id).length > 0) {
            throw new ConflictError(Messages.CATEGORY_HAS_PRODUCTS);
        }
        return CategoriaRepository.delete(id);
    }
}

export default new CategoriaService();

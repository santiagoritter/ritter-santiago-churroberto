import Producto from "../models/Producto.js";
import { Messages } from "../enums/Messages.js";
import { ConflictError, NotFoundError } from "../exceptions/AppError.js";
import ProductoRepository from "../repositories/ProductoRepository.js";
import CategoriaRepository from "../repositories/CategoriaRepository.js";

class ProductoService {
    listar({ categoriaId } = {}) {
        return categoriaId ? ProductoRepository.findByCategoria(categoriaId) : ProductoRepository.findAll();
    }

    obtener(id) {
        const producto = ProductoRepository.findById(id);
        if (!producto) {
            throw new NotFoundError(Messages.PRODUCT_NOT_FOUND);
        }
        return producto;
    }

    crear(datos) {
        this.#exigirCategoria(datos.categoriaId);
        if (ProductoRepository.findByNombre(datos.nombre)) {
            throw new ConflictError(Messages.PRODUCT_DUPLICATED);
        }
        const producto = new Producto(
            null,
            datos.nombre,
            datos.descripcion,
            datos.precio,
            datos.imagen,
            datos.stock,
            datos.categoriaId
        );
        return ProductoRepository.save(producto);
    }

    actualizar(id, datos) {
        this.obtener(id);
        this.#exigirCategoria(datos.categoriaId);
        const mismoNombre = ProductoRepository.findByNombre(datos.nombre);
        if (mismoNombre && mismoNombre.id !== id) {
            throw new ConflictError(Messages.PRODUCT_DUPLICATED);
        }
        return ProductoRepository.update(id, datos);
    }

    eliminar(id) {
        this.obtener(id);
        return ProductoRepository.delete(id);
    }

    #exigirCategoria(categoriaId) {
        if (!CategoriaRepository.findById(categoriaId)) {
            throw new NotFoundError(Messages.CATEGORY_NOT_FOUND);
        }
    }
}

export default new ProductoService();

import ApiResponse from "../responses/ApiResponse.js";
import ProductoService from "../services/ProductoService.js";
import { parseId } from "../utils/validators.js";

const ProductoController = {
    listar: (req, res) => {
        const categoriaId = req.query.categoriaId ? parseId(req.query.categoriaId) : undefined;
        ApiResponse.success(res, ProductoService.listar({ categoriaId }));
    },

    obtener: (req, res) => {
        ApiResponse.success(res, ProductoService.obtener(req.params.id));
    },

    crear: (req, res) => {
        ApiResponse.created(res, ProductoService.crear(req.body));
    },

    actualizar: (req, res) => {
        ApiResponse.success(res, ProductoService.actualizar(req.params.id, req.body));
    },

    eliminar: (req, res) => {
        ApiResponse.success(res, ProductoService.eliminar(req.params.id));
    }
};

export default ProductoController;

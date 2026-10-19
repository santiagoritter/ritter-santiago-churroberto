import ApiResponse from "../responses/ApiResponse.js";
import CategoriaService from "../services/CategoriaService.js";

const CategoriaController = {
    listar: (req, res) => {
        ApiResponse.success(res, CategoriaService.listar());
    },

    obtener: (req, res) => {
        ApiResponse.success(res, CategoriaService.obtener(req.params.id));
    },

    crear: (req, res) => {
        ApiResponse.created(res, CategoriaService.crear(req.body));
    },

    actualizar: (req, res) => {
        ApiResponse.success(res, CategoriaService.actualizar(req.params.id, req.body));
    },

    eliminar: (req, res) => {
        ApiResponse.success(res, CategoriaService.eliminar(req.params.id));
    }
};

export default CategoriaController;

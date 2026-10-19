import ApiResponse from "../responses/ApiResponse.js";
import PedidoService from "../services/PedidoService.js";

const PedidoController = {
    crear: (req, res) => {
        ApiResponse.created(res, PedidoService.crear(req.usuario.id, req.body));
    },

    listarMios: (req, res) => {
        ApiResponse.success(res, PedidoService.listarDe(req.usuario.id));
    },

    listarTodos: (req, res) => {
        ApiResponse.success(res, PedidoService.listarTodos());
    },

    obtener: (req, res) => {
        ApiResponse.success(res, PedidoService.obtener(req.params.id, req.usuario));
    },

    cambiarEstado: (req, res) => {
        ApiResponse.success(res, PedidoService.cambiarEstado(req.params.id, req.body.estado));
    },

    cancelar: (req, res) => {
        ApiResponse.success(res, PedidoService.cancelar(req.params.id, req.usuario));
    }
};

export default PedidoController;

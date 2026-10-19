import ApiResponse from "../responses/ApiResponse.js";
import CarritoService from "../services/CarritoService.js";

const CarritoController = {
    obtener: (req, res) => {
        ApiResponse.success(res, CarritoService.obtener(req.usuario.id));
    },

    agregarItem: (req, res) => {
        ApiResponse.created(res, CarritoService.agregarItem(req.usuario.id, req.body));
    },

    actualizarItem: (req, res) => {
        ApiResponse.success(res, CarritoService.actualizarItem(req.usuario.id, req.params.itemId, req.body));
    },

    quitarItem: (req, res) => {
        ApiResponse.success(res, CarritoService.quitarItem(req.usuario.id, req.params.itemId));
    },

    vaciar: (req, res) => {
        ApiResponse.success(res, CarritoService.vaciar(req.usuario.id));
    }
};

export default CarritoController;

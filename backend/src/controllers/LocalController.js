import ApiResponse from "../responses/ApiResponse.js";
import LocalService from "../services/LocalService.js";
import ResenaService from "../services/ResenaService.js";

const LocalController = {
    obtener: (req, res) => {
        ApiResponse.success(res, LocalService.obtener());
    },

    listarResenas: (req, res) => {
        ApiResponse.success(res, ResenaService.listar());
    }
};

export default LocalController;

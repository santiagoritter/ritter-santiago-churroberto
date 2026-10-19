import ApiResponse from "../responses/ApiResponse.js";
import AuthService from "../services/AuthService.js";

const AuthController = {
    registrar: async (req, res) => {
        ApiResponse.created(res, await AuthService.registrar(req.body));
    },

    iniciarSesion: async (req, res) => {
        ApiResponse.success(res, await AuthService.iniciarSesion(req.body));
    },

    perfil: (req, res) => {
        ApiResponse.success(res, AuthService.perfil(req.usuario.id));
    }
};

export default AuthController;

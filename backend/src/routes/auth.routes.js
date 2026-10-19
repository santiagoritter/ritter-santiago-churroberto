import { Router } from "express";
import AuthController from "../controllers/AuthController.js";
import { autenticar } from "../middlewares/autenticar.js";
import { limitadorAuth } from "../middlewares/limitador.js";
import { validar } from "../middlewares/validar.js";
import { validarLogin, validarRegistro } from "../utils/validators.js";

const router = Router();

router.post("/registro", limitadorAuth, validar(validarRegistro), AuthController.registrar);
router.post("/login", limitadorAuth, validar(validarLogin), AuthController.iniciarSesion);
router.get("/perfil", autenticar, AuthController.perfil);

export default router;

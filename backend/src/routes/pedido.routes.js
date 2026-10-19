import { Router } from "express";
import PedidoController from "../controllers/PedidoController.js";
import { Roles } from "../enums/Roles.js";
import { autenticar, requerirRol } from "../middlewares/autenticar.js";
import { paramId, validar } from "../middlewares/validar.js";
import { validarEstado, validarPedido } from "../utils/validators.js";

const router = Router();

router.use(autenticar);
router.param("id", paramId);

// "/mios" va antes de "/:id" para que no se interprete como un identificador.
router.get("/mios", PedidoController.listarMios);
router.get("/", requerirRol(Roles.ADMIN), PedidoController.listarTodos);
router.post("/", validar(validarPedido), PedidoController.crear);
router.get("/:id", PedidoController.obtener);
router.patch("/:id/cancelar", PedidoController.cancelar);
router.patch("/:id/estado", requerirRol(Roles.ADMIN), validar(validarEstado), PedidoController.cambiarEstado);

export default router;

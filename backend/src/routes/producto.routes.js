import { Router } from "express";
import ProductoController from "../controllers/ProductoController.js";
import { Roles } from "../enums/Roles.js";
import { autenticar, requerirRol } from "../middlewares/autenticar.js";
import { paramId, validar } from "../middlewares/validar.js";
import { validarProducto } from "../utils/validators.js";

const router = Router();
const soloAdmin = [autenticar, requerirRol(Roles.ADMIN)];

router.param("id", paramId);

router.get("/", ProductoController.listar);
router.get("/:id", ProductoController.obtener);
router.post("/", soloAdmin, validar(validarProducto), ProductoController.crear);
router.put("/:id", soloAdmin, validar(validarProducto), ProductoController.actualizar);
router.delete("/:id", soloAdmin, ProductoController.eliminar);

export default router;

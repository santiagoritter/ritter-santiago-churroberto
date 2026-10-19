import { Router } from "express";
import CategoriaController from "../controllers/CategoriaController.js";
import { Roles } from "../enums/Roles.js";
import { autenticar, requerirRol } from "../middlewares/autenticar.js";
import { paramId, validar } from "../middlewares/validar.js";
import { validarCategoria } from "../utils/validators.js";

const router = Router();
const soloAdmin = [autenticar, requerirRol(Roles.ADMIN)];

router.param("id", paramId);

router.get("/", CategoriaController.listar);
router.get("/:id", CategoriaController.obtener);
router.post("/", soloAdmin, validar(validarCategoria), CategoriaController.crear);
router.put("/:id", soloAdmin, validar(validarCategoria), CategoriaController.actualizar);
router.delete("/:id", soloAdmin, CategoriaController.eliminar);

export default router;

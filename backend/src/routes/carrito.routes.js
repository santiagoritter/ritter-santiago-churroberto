import { Router } from "express";
import CarritoController from "../controllers/CarritoController.js";
import { autenticar } from "../middlewares/autenticar.js";
import { paramId, validar } from "../middlewares/validar.js";
import { validarCantidad, validarItemCarrito } from "../utils/validators.js";

const router = Router();

router.use(autenticar);
router.param("itemId", paramId);

router.get("/", CarritoController.obtener);
router.delete("/", CarritoController.vaciar);
router.post("/items", validar(validarItemCarrito), CarritoController.agregarItem);
router.put("/items/:itemId", validar(validarCantidad), CarritoController.actualizarItem);
router.delete("/items/:itemId", CarritoController.quitarItem);

export default router;

import { Router } from "express";
import LocalController from "../controllers/LocalController.js";

const router = Router();

router.get("/local", LocalController.obtener);
router.get("/resenas", LocalController.listarResenas);

export default router;

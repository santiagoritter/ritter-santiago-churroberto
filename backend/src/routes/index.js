import { Router } from "express";
import ApiResponse from "../responses/ApiResponse.js";
import authRoutes from "./auth.routes.js";
import carritoRoutes from "./carrito.routes.js";
import categoriaRoutes from "./categoria.routes.js";
import localRoutes from "./local.routes.js";
import pedidoRoutes from "./pedido.routes.js";
import productoRoutes from "./producto.routes.js";

const router = Router();

router.get("/health", (req, res) => ApiResponse.success(res, { estado: "ok" }));
router.use("/auth", authRoutes);
router.use("/productos", productoRoutes);
router.use("/categorias", categoriaRoutes);
router.use("/carrito", carritoRoutes);
router.use("/pedidos", pedidoRoutes);
router.use("/", localRoutes);

export default router;

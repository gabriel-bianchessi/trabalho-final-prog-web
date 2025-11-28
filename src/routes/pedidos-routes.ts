import { Router, type IRouter } from "express";
import { PedidosController } from "../controllers/PedidosController";
import { authMiddleware } from "../middlewares/authMiddleware";

const router: IRouter = Router();

router.use(authMiddleware);

router.post("/", PedidosController.criar);
router.get("/", PedidosController.listar);

export default router;

import { Router, type IRouter } from "express";
import { ClientesController } from "../controllers/ClientesController";

const router: IRouter = Router();

router.post("/registrar", ClientesController.registrar);
router.post("/login", ClientesController.login);

export default router;

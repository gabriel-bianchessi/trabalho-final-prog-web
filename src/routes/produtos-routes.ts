import { Router, type IRouter } from "express";
import { ProdutosController } from "../controllers/ProdutosController";
import { authMiddleware } from "../middlewares/authMiddleware";

const router: IRouter = Router();

router.get("/", ProdutosController.listar);
router.post("/popular", ProdutosController.popularProdutos);
router.get("/:id", ProdutosController.detalharProduto);
router.post("/:id/validar-estoque", authMiddleware, ProdutosController.validarEstoque);

export default router;
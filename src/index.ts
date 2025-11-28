import express, { type Request, type Response } from "express";
import produtosRoutes from "./routes/produtos-routes";
import clientesRoutes from "./routes/clientes-routes";
import pedidosRoutes from "./routes/pedidos-routes";
import { errorHandler } from "./middlewares/errorHandler";

const PORT = process.env.PORT || 3000;

const app = express();

app.use(express.json());

app.get("/api/health", (request: Request, response: Response) => {
  return response.status(200).send({
    message: "All ok",
  });
});

app.use("/api/produtos", produtosRoutes);
app.use("/api/clientes", clientesRoutes);
app.use("/api/pedidos", pedidosRoutes);

app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`✅ Server rodando em http://localhost:${PORT || 3000}`);
});

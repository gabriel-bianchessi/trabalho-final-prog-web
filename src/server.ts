import express, { type Request, type Response } from "express";

const PORT = process.env.PORT || 3000;

const app = express();

app.get("/api/health", (request: Request, response: Response) => {
  return response.status(200).send({
    message: "All ok",
  });
});

app.listen(PORT, () => {
  console.log(`✅ Server rodando em http://localhost:${PORT || 3000}`);
});

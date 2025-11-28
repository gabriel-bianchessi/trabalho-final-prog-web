import type { NextFunction, Response } from "express";
import { PedidosRepository } from "../application/repositories/PedidosRepository";
import { ProdutosRepository } from "../application/repositories/ProdutosRepository";
import { CriarPedidoUseCase } from "../application/use_cases/CriarPedidoUseCase";
import { ListarPedidosUseCase } from "../application/use_cases/ListarPedidosUseCase";
import type { AuthenticatedRequest } from '../middlewares/authMiddleware';

export class PedidosController {
  static async criar(request: AuthenticatedRequest, response: Response, next: NextFunction) {
    try {
      const { meio_pagamento, itens } = request.body;
      const clienteId = request.clienteId!;

      const pedidosRepository = new PedidosRepository();
      const produtosRepository = new ProdutosRepository();
      const criarPedidoUseCase = new CriarPedidoUseCase(pedidosRepository, produtosRepository);

      const pedido = await criarPedidoUseCase.execute({
        id_cliente: clienteId,
        meio_pagamento,
        itens
      });

      return response.status(201).json(pedido);
    } catch (err) {
      next(err);
    }
  }

  static async listar(request: AuthenticatedRequest, response: Response, next: NextFunction) {
    try {
      const clienteId = request.clienteId!;

      const pedidosRepository = new PedidosRepository();
      const listarPedidosUseCase = new ListarPedidosUseCase(pedidosRepository);

      const pedidos = await listarPedidosUseCase.execute(clienteId);

      return response.status(200).json(pedidos);
    } catch (err) {
      next(err);
    }
  }
}

import type { NextFunction, Request, Response } from "express";
import { ClientesRepository } from "../application/repositories/ClientesRepository";
import { RegistrarClienteUseCase } from "../application/use_cases/RegistrarClienteUseCase";
import { LoginClienteUseCase } from "../application/use_cases/LoginClienteUseCase";

export class ClientesController {
  static async registrar(request: Request, response: Response, next: NextFunction) {
    try {
      const { nome, data_nasc, documento, email, senha } = request.body;

      const clientesRepository = new ClientesRepository();
      const registrarClienteUseCase = new RegistrarClienteUseCase(clientesRepository);

      const cliente = await registrarClienteUseCase.execute({
        nome,
        data_nasc,
        documento,
        email,
        senha
      });

      return response.status(201).json(cliente);
    } catch (err) {
      next(err);
    }
  }

  static async login(request: Request, response: Response, next: NextFunction) {
    try {
      const { email, senha } = request.body;

      const clientesRepository = new ClientesRepository();
      const loginClienteUseCase = new LoginClienteUseCase(clientesRepository);

      const result = await loginClienteUseCase.execute({ email, senha });

      return response.status(200).json(result);
    } catch (err) {
      next(err);
    }
  }
}

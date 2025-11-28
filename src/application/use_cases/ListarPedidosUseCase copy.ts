import type { CategoriasRepository } from '../repositories/CategoriasRepository';
import { PedidosRepository } from "../repositories/PedidosRepository";

export class ListarCategoriasUseCase {
  constructor(private categoriasRepository: CategoriasRepository) {}

  async execute() {
    return this.categoriasRepository.getAll();
  }
}

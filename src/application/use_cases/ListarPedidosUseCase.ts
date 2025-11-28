import { PedidosRepository } from "../repositories/PedidosRepository";

export class ListarPedidosUseCase {
  constructor(private pedidosRepository: PedidosRepository) {}

  async execute(clienteId: number) {
    const pedidos = await this.pedidosRepository.findByClienteId(clienteId);

    return pedidos.map(pedido => ({
      id: pedido.id,
      valor: pedido.valor,
      meio_pagamento: pedido.meio_pagamento,
      data_criacao: pedido.data_criacao,
      status: pedido.statusPagamentoPedidos[0]?.status || "PENDENTE",
      itens: pedido.itemPedidos.map(item => ({
        produto_id: item.id_produto,
        produto_titulo: item.produto.titulo,
        valor_pago: item.valor_pago,
        imagem_url: item.produto.imagem_url
      }))
    }));
  }
}

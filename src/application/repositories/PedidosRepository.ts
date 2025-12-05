import { prisma } from "../../db/prisma/client";
import type { Pedido } from "../../generated/prisma/client";
import { MeiosPagamento, StatusPagamento } from "../../generated/prisma";

interface CreatePedidoData {
  id_cliente: number;
  valor: number;
  meio_pagamento: MeiosPagamento;
  itens: {
    id_produto: number;
    quantidade: number;
    valor_pago: number;
  }[];
}

export class PedidosRepository {
  async create(data: CreatePedidoData): Promise<Pedido> {
    return await prisma.$transaction(async (tx) => {
      for (const item of data.itens) {
        const produto = await tx.produto.findUnique({
          where: { id: item.id_produto }
        });

        if (!produto || produto.quantidade < item.quantidade) {
          throw new Error(
            `Estoque insuficiente para o produto ${item.id_produto}`
          );
        }
      }

      const pedido = await tx.pedido.create({
        data: {
          id_cliente: data.id_cliente,
          valor: data.valor,
          meio_pagamento: data.meio_pagamento
        }
      });

      for (const item of data.itens) {
        await tx.itemPedido.create({
          data: {
            id_pedido: pedido.id,
            id_produto: item.id_produto,
            quantidade: item.quantidade,
            valor_pago: item.valor_pago
          }
        });

        await tx.produto.update({
          where: { id: item.id_produto },
          data: {
            quantidade: {
              decrement: item.quantidade
            }
          }
        });
      }

      await tx.statusPagamentoPedido.create({
        data: {
          id_pedido: pedido.id,
          status: StatusPagamento.PENDENTE
        }
      });

      return pedido;
    });
  }

  async findByClienteId(clienteId: number) {
    return await prisma.pedido.findMany({
      where: { id_cliente: clienteId },
      include: {
        itemPedidos: {
          include: {
            produto: true
          }
        },
        statusPagamentoPedidos: {
          orderBy: {
            data: "desc"
          },
          take: 1
        }
      },
      orderBy: {
        data_criacao: "desc"
      }
    });
  }
}

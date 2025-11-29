import { prisma } from "../../db/prisma/client";
import type { Produto } from "../../generated/prisma";

interface CreateProdutoData {
  titulo: string;
  preco: number;
  imagem_url: string;
  quantidade: number;
  descricao: string;
}

export class ProdutosRepository {
  async findAll(filters?: { categoria?: string; titulo?: string }) {
    const where: any = {};

    if (filters?.titulo) {
      where.titulo = {
        contains: filters.titulo
      };
    }

    if (filters?.categoria) {
      where.categoriaDeProduto = {
        some: {
          categoria: {
            titulo: {
              contains: filters.categoria
            }
          }
        }
      };
    }

    return await prisma.produto.findMany({
      where,
      include: {
        categoriaDeProduto: {
          include: {
            categoria: true
          }
        }
      }
    });
  }

  async findById(id: number) {
    return await prisma.produto.findUnique({
      where: { id },
      include: {
        categoriaDeProduto: {
          include: {
            categoria: true
          }
        }
      }
    });
  }

  async findByTitulo(titulo: string): Promise<Produto | null> {
    return await prisma.produto.findFirst({
      where: { titulo }
    });
  }

  async create(data: CreateProdutoData): Promise<Produto> {
    return await prisma.produto.create({
      data: {
        titulo: data.titulo,
        preco: data.preco,
        imagem_url: data.imagem_url,
        quantidade: data.quantidade,
        descricao: data.descricao
      }
    });
  }

  async incrementQuantity(id: number, quantidade: number): Promise<Produto> {
    return await prisma.produto.update({
      where: { id },
      data: {
        quantidade: {
          increment: quantidade
        }
      }
    });
  }

  async createCategoria(titulo: string) {
    return await prisma.categoria.findFirst({
      where: { titulo }
    }) ?? await prisma.categoria.create({
      data: { titulo }
    });
  }

  async linkProdutoCategoria(idProduto: number, idCategoria: number) {
    const exists = await prisma.catedoriaDeProduto.findFirst({
      where: {
        id_produto: idProduto,
        id_categoria: idCategoria
      }
    });

    if (!exists) {
      await prisma.catedoriaDeProduto.create({
        data: {
          id_produto: idProduto,
          id_categoria: idCategoria
        }
      });
    }
  }
}

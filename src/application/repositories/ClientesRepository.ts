import { prisma } from "../../db/prisma/client";
import { Cliente } from "../../generated/prisma/client";

interface CreateClienteData {
  nome: string;
  data_nasc: Date;
  documento: string;
  email: string;
  senha: string;
}

export class ClientesRepository {
  async findByEmail(email: string): Promise<Cliente | null> {
    return await prisma.cliente.findUnique({
      where: { email }
    });
  }

  async findByDocumento(documento: string): Promise<Cliente | null> {
    return await prisma.cliente.findUnique({
      where: { documento }
    });
  }

  async findById(id: number): Promise<Cliente | null> {
    return await prisma.cliente.findUnique({
      where: { id }
    });
  }

  async create(data: CreateClienteData): Promise<Cliente> {
    return await prisma.cliente.create({
      data
    });
  }
}

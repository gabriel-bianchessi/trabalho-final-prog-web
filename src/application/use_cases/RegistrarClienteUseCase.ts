import { ClientesRepository } from "../repositories/ClientesRepository";
import { BcryptHelper } from "../../utils/bcryptHelper";
import { ClienteAlreadyExistsError } from "../errors/ClienteAlreadyExistsError";

interface RegistrarClienteInput {
  nome: string;
  data_nasc: string;
  documento: string;
  email: string;
  senha: string;
}

export class RegistrarClienteUseCase {
  constructor(private clientesRepository: ClientesRepository) {}

  async execute(input: RegistrarClienteInput) {
    const clienteExistenteEmail = await this.clientesRepository.findByEmail(input.email);
    
    if (clienteExistenteEmail) {
      throw new ClienteAlreadyExistsError("Email já cadastrado");
    }

    const clienteExistenteDocumento = await this.clientesRepository.findByDocumento(input.documento);
    
    if (clienteExistenteDocumento) {
      throw new ClienteAlreadyExistsError("Documento já cadastrado");
    }

    const senhaHash = await BcryptHelper.hash(input.senha);

    const cliente = await this.clientesRepository.create({
      nome: input.nome,
      data_nasc: new Date(input.data_nasc),
      documento: input.documento,
      email: input.email,
      senha: senhaHash
    });

    return {
      id: cliente.id,
      nome: cliente.nome,
      email: cliente.email,
      documento: cliente.documento,
      data_nasc: cliente.data_nasc
    };
  }
}

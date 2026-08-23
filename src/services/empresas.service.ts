import { NotFoundError, BadRequestError } from "../errors/AppError";
import { empresasRepository } from "../repositories/empresas.repository";
import {
  EmpresaBody,
  ConfigFiscalBody,
  ContaBancariaBody,
} from "../types/empresa.types";

// Helper reutilizável — vamos usar isto em TODOS os métodos que recebem um empresa_id
async function garantirEmpresaExiste(id: string) {
  const empresa = await empresasRepository.buscarPorId(id);
  if (empresa === undefined) {
    throw new NotFoundError("Empresa não encontrada.");
  }
  return empresa;
}

export const empresasService = {
  async listarTodas() {
    return empresasRepository.listarTodas();
  },

  async obterPorId(id: string) {
    return garantirEmpresaExiste(id); // já lança NotFoundError se não existir
  },

  async criar(b: EmpresaBody) {
    if (!b.nome) throw new BadRequestError("O nome da empresa é obrigatório.");

    return empresasRepository.inserir(b);
  },

  async editar(id: string, b: EmpresaBody) {
    await garantirEmpresaExiste(id);

    return empresasRepository.actualizar(id, b);
  },

  async obterConfigFiscal(id: string) {
    await garantirEmpresaExiste(id); // resolve o bug das "empresas fantasmas"

    const config = await empresasRepository.buscarConfigFiscal(id);
    return (
      config || {
        empresa_id: Number(id),
        taxa_inss_funcionario: 3.0,
        taxa_inss_entidade: 8.0,
        subsidio_alimentacao: 15000.0,
        subsidio_transporte: 10000.0,
      }
    );
  },

  async atualizarConfigFiscal(id: string, b: ConfigFiscalBody) {
    await garantirEmpresaExiste(id); // resolve o bug do erro 500

    return empresasRepository.upsertConfigFiscal(id, b);
  },

  async listarContasBancarias(id: string) {
    await garantirEmpresaExiste(id);
    return empresasRepository.listarContasBancarias(id);
  },

  async criarContaBancaria(id: string, b: ContaBancariaBody) {
    await garantirEmpresaExiste(id);
    if (!b.numero_conta)
      throw new BadRequestError("O número de conta é obrigatório.");

    return empresasRepository.inserirContaBancaria(id, b);
  },
};

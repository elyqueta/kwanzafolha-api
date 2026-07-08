import { Request, Response } from 'express';
import { asyncHandler } from '../utils/asyncHandler';
import { empresasService } from '../services/empresas.service';
import { EmpresaBody, ConfigFiscalBody, ContaBancariaBody } from '../types/empresa.types';

export const listarEmpresas = asyncHandler(async (req: Request, res: Response) => {
  const empresas = await empresasService.listarTodas();
  res.json({ empresas });
});

export const obterEmpresa = asyncHandler(async (req: Request<{ id: string }>, res: Response) => {
  const empresa = await empresasService.obterPorId(req.params.id);
  res.json(empresa);
});

export const criarEmpresa = asyncHandler(async (req: Request<{}, {}, EmpresaBody>, res: Response) => {
  const empresa = await empresasService.criar(req.body);
  res.status(201).json(empresa);
});

export const editarEmpresa = asyncHandler(async (req: Request<{ id: string }, {}, EmpresaBody>, res: Response) => {
  const empresa = await empresasService.editar(req.params.id, req.body);
  res.json(empresa);
});

export const obterConfigFiscal = asyncHandler(async (req: Request<{ id: string }>, res: Response) => {
  const config = await empresasService.obterConfigFiscal(req.params.id);
  res.json(config);
});

export const atualizarConfigFiscal = asyncHandler(async (req: Request<{ id: string }, {}, ConfigFiscalBody>, res: Response) => {
  const config = await empresasService.atualizarConfigFiscal(req.params.id, req.body);
  res.json(config);
});

export const listarContasBancarias = asyncHandler(async (req: Request<{ id: string }>, res: Response) => {
  const contas = await empresasService.listarContasBancarias(req.params.id);
  res.json({ contas });
});

export const criarContaBancaria = asyncHandler(async (req: Request<{ id: string }, {}, ContaBancariaBody>, res: Response) => {
  const conta = await empresasService.criarContaBancaria(req.params.id, req.body);
  res.status(201).json(conta);
});
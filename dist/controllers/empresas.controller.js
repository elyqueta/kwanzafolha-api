"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.criarContaBancaria = exports.listarContasBancarias = exports.atualizarConfigFiscal = exports.obterConfigFiscal = exports.editarEmpresa = exports.criarEmpresa = exports.obterEmpresa = exports.listarEmpresas = void 0;
const asyncHandler_1 = require("../utils/asyncHandler");
const empresas_service_1 = require("../services/empresas.service");
exports.listarEmpresas = (0, asyncHandler_1.asyncHandler)(async (_req, res) => {
    const empresas = await empresas_service_1.empresasService.listarTodas();
    res.json({ empresas });
});
exports.obterEmpresa = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const empresa = await empresas_service_1.empresasService.obterPorId(req.params.id);
    res.json(empresa);
});
exports.criarEmpresa = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const empresa = await empresas_service_1.empresasService.criar(req.body);
    res.status(201).json(empresa);
});
exports.editarEmpresa = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const empresa = await empresas_service_1.empresasService.editar(req.params.id, req.body);
    res.json(empresa);
});
exports.obterConfigFiscal = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const config = await empresas_service_1.empresasService.obterConfigFiscal(req.params.id);
    res.json(config);
});
exports.atualizarConfigFiscal = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const config = await empresas_service_1.empresasService.atualizarConfigFiscal(req.params.id, req.body);
    res.json(config);
});
exports.listarContasBancarias = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const contas = await empresas_service_1.empresasService.listarContasBancarias(req.params.id);
    res.json({ contas });
});
exports.criarContaBancaria = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const conta = await empresas_service_1.empresasService.criarContaBancaria(req.params.id, req.body);
    res.status(201).json(conta);
});
//# sourceMappingURL=empresas.controller.js.map
export class AppError extends Error {
  public statusCode: number;

  constructor(message: string, statusCode: number) {
    super(message);
    this.statusCode = statusCode;
    this.name = 'AppError';
  }
}

// Atalhos para os erros mais comuns — usamos estes em vez do genérico
export class NotFoundError extends AppError {
  constructor(message = 'Recurso não encontrado.') {
    super(message, 404);
  }
}

export class ConflictError extends AppError {
  constructor(message = 'Conflito de dados.') {
    super(message, 409);
  }
}

export class ForbiddenError extends AppError {
  constructor(message = 'Sem permissão para esta ação.') {
    super(message, 403);
  }
}

export class BadRequestError extends AppError {
  constructor(message = 'Pedido inválido.') {
    super(message, 400);
  }
}
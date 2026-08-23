export interface JwtPayload {
  id: string;
  email: string;
  role: string;
}

export interface LoginRequestBody {
  email: string;
  password: string;
}

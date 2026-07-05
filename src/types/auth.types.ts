export interface JwtPayload {
  id: number;
  email: string;
  role: string;
}

export interface LoginRequestBody {
  email: string;
  password: string;
}
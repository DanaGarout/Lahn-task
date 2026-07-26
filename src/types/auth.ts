// matches what POST /auth/login actually returns

export interface LoginPayload {
  email: string
  password: string
}

export interface AuthUser {
  id: number
  name: string
  email: string
  role: string
}

export interface LoginResponse {
  accessToken: string
  tokenType: string
  expiresIn: number // seconds
  expiresAt?: string // exact timestamp, use this over expiresIn when it's there
  user: AuthUser
}
import axios from 'axios'
import { Role, UserDTO } from '@/types/auth'
import { ApiEnvelope } from '@/types/api'

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:8080/api/v1'

export interface LoginInput {
  email: string
  password: string
}

// Shape the backend actually returns
interface BackendLoginResponse {
  access_token: string
  expires_at: string
  user: {
    id: string
    email: string
    name: string
  }
}

export interface LoginResponse {
  token: string
  expiresAt: string
  user: UserDTO
  role: Role
}

function decodeJwtPayload(token: string): Record<string, unknown> {
  try {
    return JSON.parse(atob(token.split('.')[1]))
  } catch {
    return {}
  }
}

// Raw axios (no interceptor) for auth calls to avoid circular re-auth loops
export async function login(orgSlug: string, input: LoginInput): Promise<LoginResponse> {
  const res = await axios.post<ApiEnvelope<BackendLoginResponse>>(
    `${API_URL}/auth/login`,
    input,
    { headers: { 'X-Org-Slug': orgSlug, 'Content-Type': 'application/json' } }
  )
  const raw = res.data.data
  const payload = decodeJwtPayload(raw.access_token)
  const role = (payload.role as Role) ?? 'student'
  const nameParts = raw.user.name.split(' ')
  return {
    token: raw.access_token,
    expiresAt: raw.expires_at,
    role,
    user: {
      id: raw.user.id,
      email: raw.user.email,
      first_name: nameParts[0] ?? '',
      last_name: nameParts.slice(1).join(' ') ?? '',
      role,
      org_id: (payload.org_id as string) ?? '',
    },
  }
}

export interface RegisterInput {
  email: string
  password: string
  first_name: string
  last_name: string
  role?: string
}

export async function superAdminLogin(input: LoginInput): Promise<LoginResponse> {
  const res = await axios.post<ApiEnvelope<BackendLoginResponse>>(
    `${API_URL}/super-admin/auth/login`,
    input,
    { headers: { 'Content-Type': 'application/json' } }
  )
  const raw = res.data.data
  const payload = decodeJwtPayload(raw.access_token)
  const role = (payload.role as Role) ?? 'super_admin'
  const nameParts = raw.user.name.split(' ')
  return {
    token: raw.access_token,
    expiresAt: raw.expires_at,
    role,
    user: {
      id: raw.user.id,
      email: raw.user.email,
      first_name: nameParts[0] ?? '',
      last_name: nameParts.slice(1).join(' ') ?? '',
      role,
      org_id: '',
    },
  }
}

export async function register(orgSlug: string, input: RegisterInput): Promise<UserDTO> {
  const res = await axios.post<ApiEnvelope<UserDTO>>(
    `${API_URL}/auth/register`,
    input,
    { headers: { 'X-Org-Slug': orgSlug, 'Content-Type': 'application/json' } }
  )
  return res.data.data
}

export async function getMe(token: string, orgSlug: string): Promise<UserDTO> {
  const res = await axios.get<ApiEnvelope<UserDTO>>(
    `${API_URL}/auth/me`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
        'X-Org-Slug': orgSlug,
        'Content-Type': 'application/json',
      },
    }
  )
  return res.data.data
}

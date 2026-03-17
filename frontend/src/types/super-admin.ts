export interface OrgDTO {
  id: string
  name: string
  slug: string
  created_at: string
}

export interface AdminUserDTO {
  id: string
  email: string
  name: string
  created_at: string
}

export interface SystemStatsDTO {
  total_orgs: number
  total_users: number
}

export interface InviteOrgAdminInput {
  email: string
  name: string
  password: string
  org_id: string
}

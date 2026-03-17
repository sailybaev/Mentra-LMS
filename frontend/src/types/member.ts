export type MemberRole = 'admin' | 'teacher' | 'student'

export interface MemberDTO {
  id: string
  user_id: string
  org_id: string
  role: MemberRole
  name: string
  email: string
  joined_at: string
}

export interface InviteMemberInput {
  name: string
  email: string
  password: string
  role: MemberRole
}

export interface UpdateMemberRoleInput {
  role: MemberRole
}

export interface CSVRowError {
  row: number
  email: string
  error: string
}

export interface CSVImportedUser {
  name: string
  email: string
  role: string
  password?: string
}

export interface CSVImportResult {
  imported: CSVImportedUser[]
  errors: CSVRowError[]
}

import { Role } from '@/types/auth'

export const ROLE_BASE_PATHS: Record<Role, string> = {
  super_admin: 'admin',
  admin: 'admin',
  teacher: 'teacher',
  student: 'student',
}

export function getRoleBasePath(role: Role): string {
  return ROLE_BASE_PATHS[role] ?? 'student'
}

export function canAccess(role: Role, path: 'admin' | 'teacher' | 'student'): boolean {
  const permissions: Record<string, Role[]> = {
    admin: ['admin', 'super_admin'],
    teacher: ['teacher', 'admin', 'super_admin'],
    student: ['student', 'admin', 'super_admin'],
  }
  return permissions[path]?.includes(role) ?? false
}

import { NextRequest, NextResponse } from 'next/server'

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Super admin routes — guard before org regex
  if (pathname.startsWith('/super-admin')) {
    const roleCookie = request.cookies.get('mentra-role')?.value
    if (roleCookie !== 'super_admin') {
      return NextResponse.redirect(new URL('/login', request.url))
    }
    return NextResponse.next()
  }

  // Extract org slug from path
  const orgMatch = pathname.match(/^\/([^/]+)\/(.+)/)
  if (!orgMatch) return NextResponse.next()

  const [, orgSlug, rest] = orgMatch
  const roleCookie = request.cookies.get('mentra-role')?.value
  const orgCookie = request.cookies.get('mentra-org')?.value

  // Allow login route without auth
  if (rest === 'login') return NextResponse.next()

  // No session → redirect to org-scoped login
  if (!roleCookie) {
    const loginUrl = new URL(`/${orgSlug}/login`, request.url)
    loginUrl.searchParams.set('returnTo', pathname)
    return NextResponse.redirect(loginUrl)
  }

  const role = roleCookie as string

  // Role-based access rules
  const isAdminPath = rest.startsWith('admin')
  const isTeacherPath = rest.startsWith('teacher')
  const isStudentPath = rest.startsWith('student')

  const adminRoles = ['admin', 'super_admin']
  const teacherRoles = ['teacher', 'admin', 'super_admin']
  const studentRoles = ['student', 'admin', 'super_admin']

  let correctBasePath: string | null = null

  if (isAdminPath && !adminRoles.includes(role)) {
    correctBasePath = getCorrectPath(role)
  } else if (isTeacherPath && !teacherRoles.includes(role)) {
    correctBasePath = getCorrectPath(role)
  } else if (isStudentPath && !studentRoles.includes(role)) {
    correctBasePath = getCorrectPath(role)
  }

  if (correctBasePath !== null) {
    const correctOrg = orgCookie ?? orgSlug
    return NextResponse.redirect(new URL(`/${correctOrg}/${correctBasePath}`, request.url))
  }

  return NextResponse.next()
}

function getCorrectPath(role: string): string {
  switch (role) {
    case 'admin':
    case 'super_admin':
      return 'admin'
    case 'teacher':
      return 'teacher'
    case 'student':
    default:
      return 'student'
  }
}

export const config = {
  matcher: ['/((?!api|_next|login|register|$).*)'],
}

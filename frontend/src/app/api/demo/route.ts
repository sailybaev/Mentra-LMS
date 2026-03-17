import { NextRequest, NextResponse } from 'next/server'

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:8080/api/v1'

export async function POST(request: NextRequest) {
  try {
    const { org_slug, email, password } = await request.json()

    if (!org_slug || !email || !password) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    // Step 1: Authenticate
    const loginRes = await fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'X-Org-Slug': org_slug },
      body: JSON.stringify({ email, password }),
    })

    if (!loginRes.ok) {
      const body = await loginRes.json().catch(() => ({}))
      return NextResponse.json(
        { error: body?.error?.message ?? 'Invalid credentials' },
        { status: 401 }
      )
    }

    const loginData = await loginRes.json()
    const token = loginData.data?.token?.access_token ?? loginData.data?.access_token

    if (!token) {
      return NextResponse.json({ error: 'Authentication failed' }, { status: 401 })
    }

    const headers = {
      Authorization: `Bearer ${token}`,
      'X-Org-Slug': org_slug,
      'Content-Type': 'application/json',
    }

    // Step 2: Get courses
    const coursesRes = await fetch(`${API_URL}/courses?page=1&page_size=1`, { headers })
    if (!coursesRes.ok) {
      return NextResponse.json({ error: 'Could not fetch courses' }, { status: 500 })
    }
    const coursesData = await coursesRes.json()
    const firstCourse = coursesData.data?.[0] ?? coursesData.data?.data?.[0]

    if (!firstCourse) {
      return NextResponse.json({ error: 'No courses found. Create a course with content first.' }, { status: 404 })
    }

    // Step 3: Get modules
    const modulesRes = await fetch(`${API_URL}/courses/${firstCourse.id}/modules`, { headers })
    if (!modulesRes.ok) {
      return NextResponse.json({ error: 'No modules found in the first course.' }, { status: 404 })
    }
    const modulesData = await modulesRes.json()
    const firstModule = modulesData.data?.[0] ?? (Array.isArray(modulesData.data) ? modulesData.data[0] : null)

    if (!firstModule) {
      return NextResponse.json({ error: 'No modules found. Add a module with lessons first.' }, { status: 404 })
    }

    // Step 4: Get lessons
    const lessonsRes = await fetch(`${API_URL}/modules/${firstModule.id}/lessons`, { headers })
    if (!lessonsRes.ok) {
      return NextResponse.json({ error: 'No lessons found.' }, { status: 404 })
    }
    const lessonsData = await lessonsRes.json()
    const firstLesson = lessonsData.data?.[0] ?? (Array.isArray(lessonsData.data) ? lessonsData.data[0] : null)

    if (!firstLesson) {
      return NextResponse.json({ error: 'No lessons found. Add a lesson with text content first.' }, { status: 404 })
    }

    // Step 5: Generate quiz
    const quizRes = await fetch(`${API_URL}/ai/generate-quiz`, {
      method: 'POST',
      headers,
      body: JSON.stringify({ lesson_id: firstLesson.id, num_questions: 3 }),
    })

    if (!quizRes.ok) {
      const qBody = await quizRes.json().catch(() => ({}))
      return NextResponse.json(
        { error: qBody?.error?.message ?? 'AI quiz generation failed. Make sure the lesson has text content.' },
        { status: 500 }
      )
    }

    const quizData = await quizRes.json()
    const quiz = quizData.data ?? quizData

    return NextResponse.json({ quiz, state: 'result' })
  } catch (err) {
    console.error('Demo API error:', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

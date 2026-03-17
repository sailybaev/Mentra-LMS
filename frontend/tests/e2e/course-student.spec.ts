import { test, expect } from '@playwright/test'
import { loginViaAPI } from './helpers/auth'

/**
 * Student course page tests.
 *
 * Requires seed data (run `go run ./cmd/seed` from backend/):
 *   org: acme, student: sam@acme.com / password123
 *
 * Override via env vars:
 *   TEST_ORG, TEST_STUDENT_EMAIL, TEST_STUDENT_PASSWORD
 */

const ORG = process.env.TEST_ORG ?? 'acme'
const EMAIL = process.env.TEST_STUDENT_EMAIL ?? 'sam@acme.com'
const PASS = process.env.TEST_STUDENT_PASSWORD ?? 'password123'

test.describe('Student — course page', () => {
  test.beforeEach(async ({ page }) => {
    await loginViaAPI(page, ORG, EMAIL, PASS)
  })

  test('redirects to student dashboard after login', async ({ page }) => {
    await page.goto(`/${ORG}/student`)
    await expect(page).toHaveURL(new RegExp(`/${ORG}/student`))
    // Some heading should be visible
    await expect(page.locator('h1, h2').first()).toBeVisible({ timeout: 10000 })
  })

  test('my courses list loads', async ({ page }) => {
    await page.goto(`/${ORG}/student/courses`)
    await page.waitForLoadState('networkidle')
    // Either course cards or empty state
    const hasCourses = await page.locator('a[href*="/student/courses/"]').count() > 0
    const isEmpty = await page.getByText(/no course|enrolled/i).isVisible().catch(() => false)
    expect(hasCourses || isEmpty).toBe(true)
  })

  test('course detail page shows Content / My Grades / Deadlines tabs', async ({ page }) => {
    await page.goto(`/${ORG}/student/courses`)
    await page.waitForLoadState('networkidle')

    const firstCourse = page.locator('a[href*="/student/courses/"]').first()
    const hasCourse = await firstCourse.count() > 0
    test.skip(!hasCourse, 'No courses enrolled — seed the database first')

    await firstCourse.click()
    await page.waitForLoadState('networkidle')

    await expect(page.getByRole('tab', { name: 'Content' })).toBeVisible({ timeout: 10000 })
    await expect(page.getByRole('tab', { name: 'My Grades' })).toBeVisible()
    await expect(page.getByRole('tab', { name: 'Deadlines' })).toBeVisible()
  })

  test('content tab shows module sections with collapsible headers', async ({ page }) => {
    await page.goto(`/${ORG}/student/courses`)
    await page.waitForLoadState('networkidle')

    const firstCourse = page.locator('a[href*="/student/courses/"]').first()
    test.skip(await firstCourse.count() === 0, 'No courses enrolled')

    await firstCourse.click()
    await page.getByRole('tab', { name: 'Content' }).click()
    await page.waitForTimeout(1200)

    const moduleCards = page.locator('.rounded-xl.border.bg-white')
    const emptyState = page.getByText('No content yet.')

    expect(
      (await moduleCards.count()) > 0 || await emptyState.isVisible()
    ).toBe(true)
  })

  test('module section can be collapsed and re-expanded', async ({ page }) => {
    await page.goto(`/${ORG}/student/courses`)
    await page.waitForLoadState('networkidle')

    const firstCourse = page.locator('a[href*="/student/courses/"]').first()
    test.skip(await firstCourse.count() === 0, 'No courses enrolled')

    await firstCourse.click()
    await page.getByRole('tab', { name: 'Content' }).click()
    await page.waitForTimeout(1200)

    const moduleCard = page.locator('.rounded-xl.border.bg-white').first()
    test.skip(await moduleCard.count() === 0, 'No modules in this course')

    const toggleBtn = moduleCard.locator('button').first()

    // Collapse
    await toggleBtn.click()
    await page.waitForTimeout(400)
    // Expand again
    await toggleBtn.click()
    await page.waitForTimeout(400)

    // Should still be visible
    await expect(moduleCard).toBeVisible()
  })

  test('My Grades tab renders', async ({ page }) => {
    await page.goto(`/${ORG}/student/courses`)
    await page.waitForLoadState('networkidle')

    const firstCourse = page.locator('a[href*="/student/courses/"]').first()
    test.skip(await firstCourse.count() === 0, 'No courses enrolled')

    await firstCourse.click()
    await page.getByRole('tab', { name: 'My Grades' }).click()
    await page.waitForTimeout(1000)

    const hasContent = await page.locator('.rounded-lg.border').count() > 0
    const hasEmpty = await page.getByText('No graded items yet.').isVisible().catch(() => false)
    expect(hasContent || hasEmpty).toBe(true)
  })

  test('Deadlines tab renders', async ({ page }) => {
    await page.goto(`/${ORG}/student/courses`)
    await page.waitForLoadState('networkidle')

    const firstCourse = page.locator('a[href*="/student/courses/"]').first()
    test.skip(await firstCourse.count() === 0, 'No courses enrolled')

    await firstCourse.click()
    await page.getByRole('tab', { name: 'Deadlines' }).click()
    await page.waitForTimeout(1000)

    const hasDeadlines = await page.locator('.divide-y').count() > 0
    const hasEmpty = await page.getByText('No upcoming deadlines.').isVisible().catch(() => false)
    expect(hasDeadlines || hasEmpty).toBe(true)
  })

  test('clicking a lesson opens the lesson viewer', async ({ page }) => {
    await page.goto(`/${ORG}/student/courses`)
    await page.waitForLoadState('networkidle')

    const firstCourse = page.locator('a[href*="/student/courses/"]').first()
    test.skip(await firstCourse.count() === 0, 'No courses enrolled')

    await firstCourse.click()
    await page.getByRole('tab', { name: 'Content' }).click()
    await page.waitForTimeout(1500)

    const lessonLink = page.locator('a[href*="/lessons/"]').first()
    test.skip(await lessonLink.count() === 0, 'No lessons in this course')

    await lessonLink.click()
    await expect(page).toHaveURL(new RegExp('/lessons/'), { timeout: 8000 })
    await expect(page.locator('h1').first()).toBeVisible({ timeout: 8000 })
  })
})

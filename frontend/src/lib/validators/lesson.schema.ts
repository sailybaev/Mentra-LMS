import { z } from 'zod'

export const lessonSchema = z.object({
  title: z.string().min(1, 'Lesson title is required').max(200),
  type: z.enum(['video', 'text', 'quiz']),
  content: z.string().min(1, 'Content is required'),
  video_url: z.string().url('Must be a valid URL').optional().or(z.literal('')),
  order: z.number().int().min(0).optional(),
})

export type LessonFormData = z.infer<typeof lessonSchema>

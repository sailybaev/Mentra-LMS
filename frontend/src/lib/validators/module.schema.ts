import { z } from 'zod'

export const moduleSchema = z.object({
  title: z.string().min(1, 'Module title is required').max(200),
  order: z.number().int().min(0).optional(),
})

export type ModuleFormData = z.infer<typeof moduleSchema>

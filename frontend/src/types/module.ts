export interface ModuleDTO {
  id: string
  course_id: string
  title: string
  order: number
  created_at: string
  updated_at: string
}

export interface CreateModuleInput {
  title: string
  order?: number
}

export interface UpdateModuleInput {
  title?: string
  order?: number
}

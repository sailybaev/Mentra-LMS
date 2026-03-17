import { apiClient } from './client'
import { ModuleDTO, CreateModuleInput, UpdateModuleInput } from '@/types/module'

export async function listModules(courseId: string): Promise<ModuleDTO[]> {
  const res = await apiClient.get<ModuleDTO[]>(`/courses/${courseId}/modules`)
  return res.data
}

export async function getModule(courseId: string, moduleId: string): Promise<ModuleDTO> {
  const res = await apiClient.get<ModuleDTO>(`/courses/${courseId}/modules/${moduleId}`)
  return res.data
}

export async function createModule(courseId: string, input: CreateModuleInput): Promise<ModuleDTO> {
  const res = await apiClient.post<ModuleDTO>(`/courses/${courseId}/modules`, input)
  return res.data
}

export async function updateModule(courseId: string, moduleId: string, input: UpdateModuleInput): Promise<ModuleDTO> {
  const res = await apiClient.put<ModuleDTO>(`/courses/${courseId}/modules/${moduleId}`, input)
  return res.data
}

export async function deleteModule(courseId: string, moduleId: string): Promise<void> {
  await apiClient.delete(`/courses/${courseId}/modules/${moduleId}`)
}

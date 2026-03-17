import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import * as modulesApi from '@/lib/api/modules'
import { CreateModuleInput, UpdateModuleInput } from '@/types/module'

export const moduleKeys = {
  all: ['modules'] as const,
  lists: () => [...moduleKeys.all, 'list'] as const,
  list: (courseId: string) => [...moduleKeys.lists(), courseId] as const,
  details: () => [...moduleKeys.all, 'detail'] as const,
  detail: (courseId: string, moduleId: string) => [...moduleKeys.details(), courseId, moduleId] as const,
}

export function useModules(courseId: string) {
  return useQuery({
    queryKey: moduleKeys.list(courseId),
    queryFn: () => modulesApi.listModules(courseId),
    enabled: !!courseId,
  })
}

export function useModule(courseId: string, moduleId: string) {
  return useQuery({
    queryKey: moduleKeys.detail(courseId, moduleId),
    queryFn: () => modulesApi.getModule(courseId, moduleId),
    enabled: !!(courseId && moduleId),
  })
}

export function useCreateModule(courseId: string) {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (input: CreateModuleInput) => modulesApi.createModule(courseId, input),
    onSuccess: () => qc.invalidateQueries({ queryKey: moduleKeys.list(courseId) }),
  })
}

export function useUpdateModule(courseId: string) {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ moduleId, input }: { moduleId: string; input: UpdateModuleInput }) =>
      modulesApi.updateModule(courseId, moduleId, input),
    onSuccess: () => qc.invalidateQueries({ queryKey: moduleKeys.list(courseId) }),
  })
}

export function useDeleteModule(courseId: string) {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (moduleId: string) => modulesApi.deleteModule(courseId, moduleId),
    onSuccess: () => qc.invalidateQueries({ queryKey: moduleKeys.list(courseId) }),
  })
}

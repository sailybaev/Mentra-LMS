import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import * as assignmentsApi from '@/lib/api/assignments';
import { CreateAssignmentInput, UpdateAssignmentInput } from '@/types/assignment';

export const assignmentKeys = {
  all: ['assignments'] as const,
  lists: () => [...assignmentKeys.all, 'list'] as const,
  list: (courseID: string, moduleID: string) => [...assignmentKeys.lists(), courseID, moduleID] as const,
  details: () => [...assignmentKeys.all, 'detail'] as const,
  detail: (id: string) => [...assignmentKeys.details(), id] as const,
  submissions: (id: string) => [...assignmentKeys.all, 'submissions', id] as const,
  mySubmission: (id: string) => [...assignmentKeys.all, 'my-submission', id] as const,
};

export function useAssignments(courseID: string, moduleID: string) {
  return useQuery({
    queryKey: assignmentKeys.list(courseID, moduleID),
    queryFn: () => assignmentsApi.listAssignments(courseID, moduleID),
    enabled: !!courseID && !!moduleID,
  });
}

export function useAssignment(id: string) {
  return useQuery({
    queryKey: assignmentKeys.detail(id),
    queryFn: () => assignmentsApi.getAssignment(id),
    enabled: !!id,
  });
}

export function useCreateAssignment(courseID: string, moduleID: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (input: CreateAssignmentInput) => assignmentsApi.createAssignment(courseID, moduleID, input),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: assignmentKeys.list(courseID, moduleID) });
    },
  });
}

export function useUpdateAssignment(courseID: string, moduleID: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, input }: { id: string; input: UpdateAssignmentInput }) =>
      assignmentsApi.updateAssignment(id, input),
    onSuccess: (_, { id }) => {
      qc.invalidateQueries({ queryKey: assignmentKeys.detail(id) });
      qc.invalidateQueries({ queryKey: assignmentKeys.list(courseID, moduleID) });
    },
  });
}

export function useDeleteAssignment(courseID: string, moduleID: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => assignmentsApi.deleteAssignment(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: assignmentKeys.list(courseID, moduleID) });
    },
  });
}

export function useSubmitAssignment(assignmentID: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (formData: FormData) => assignmentsApi.submitAssignment(assignmentID, formData),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: assignmentKeys.mySubmission(assignmentID) });
    },
  });
}

export function useMySubmission(assignmentID: string) {
  return useQuery({
    queryKey: assignmentKeys.mySubmission(assignmentID),
    queryFn: () => assignmentsApi.getMySubmission(assignmentID),
    enabled: !!assignmentID,
    retry: false,
  });
}

export function useListSubmissions(assignmentID: string) {
  return useQuery({
    queryKey: assignmentKeys.submissions(assignmentID),
    queryFn: () => assignmentsApi.listSubmissions(assignmentID),
    enabled: !!assignmentID,
  });
}

export function useDeleteMySubmission(assignmentID: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: () => assignmentsApi.deleteMySubmission(assignmentID),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: assignmentKeys.mySubmission(assignmentID) });
    },
  });
}

export function useGradeSubmission(assignmentID: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ submissionID, score, feedback }: { submissionID: string; score: number; feedback: string }) =>
      assignmentsApi.gradeSubmission(submissionID, score, feedback),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: assignmentKeys.submissions(assignmentID) });
    },
  });
}

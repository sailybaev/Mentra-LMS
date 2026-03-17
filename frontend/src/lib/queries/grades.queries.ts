import { useQuery } from '@tanstack/react-query';
import * as gradesApi from '@/lib/api/grades';

export const gradeKeys = {
  all: ['grades'] as const,
  myGrades: (courseID: string) => [...gradeKeys.all, 'my-grades', courseID] as const,
  deadlines: (courseID: string) => [...gradeKeys.all, 'deadlines', courseID] as const,
};

export function useMyGrades(courseID: string) {
  return useQuery({
    queryKey: gradeKeys.myGrades(courseID),
    queryFn: () => gradesApi.getMyGrades(courseID),
    enabled: !!courseID,
  });
}

export function useUpcomingDeadlines(courseID: string) {
  return useQuery({
    queryKey: gradeKeys.deadlines(courseID),
    queryFn: () => gradesApi.getUpcomingDeadlines(courseID),
    enabled: !!courseID,
  });
}

import { apiClient } from './client';
import { StudentGradeDTO, DeadlineItemDTO } from '@/types/grade';

export async function getMyGrades(courseID: string): Promise<StudentGradeDTO> {
  const res = await apiClient.get<StudentGradeDTO>(`/courses/${courseID}/my-grades`);
  return { ...res.data, items: res.data.items ?? [] };
}

export async function getUpcomingDeadlines(courseID: string): Promise<DeadlineItemDTO[]> {
  const res = await apiClient.get<DeadlineItemDTO[]>(`/courses/${courseID}/deadlines`);
  return res.data;
}

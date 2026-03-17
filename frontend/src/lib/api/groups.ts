import { apiClient } from './client'
import {
  GroupDTO, GroupScheduleDTO, GroupMemberDTO,
  CreateGroupInput, UpdateGroupInput, CreateGroupScheduleInput, AddMemberInput,
} from '@/types/group'

export async function listGroups(courseId: string): Promise<GroupDTO[]> {
  const res = await apiClient.get<GroupDTO[]>(`/courses/${courseId}/groups`)
  return res.data
}

export async function getGroup(courseId: string, groupId: string): Promise<GroupDTO> {
  const res = await apiClient.get<GroupDTO>(`/courses/${courseId}/groups/${groupId}`)
  return res.data
}

export async function createGroup(courseId: string, input: CreateGroupInput): Promise<GroupDTO> {
  const res = await apiClient.post<GroupDTO>(`/courses/${courseId}/groups`, input)
  return res.data
}

export async function updateGroup(courseId: string, groupId: string, input: UpdateGroupInput): Promise<GroupDTO> {
  const res = await apiClient.put<GroupDTO>(`/courses/${courseId}/groups/${groupId}`, input)
  return res.data
}

export async function deleteGroup(courseId: string, groupId: string): Promise<void> {
  await apiClient.delete(`/courses/${courseId}/groups/${groupId}`)
}

export async function listMembers(courseId: string, groupId: string): Promise<GroupMemberDTO[]> {
  const res = await apiClient.get<GroupMemberDTO[]>(`/courses/${courseId}/groups/${groupId}/members`)
  return res.data
}

export async function addMember(courseId: string, groupId: string, input: AddMemberInput): Promise<GroupMemberDTO> {
  const res = await apiClient.post<GroupMemberDTO>(`/courses/${courseId}/groups/${groupId}/members`, input)
  return res.data
}

export async function removeMember(courseId: string, groupId: string, studentId: string): Promise<void> {
  await apiClient.delete(`/courses/${courseId}/groups/${groupId}/members/${studentId}`)
}

export async function listSchedules(courseId: string, groupId: string): Promise<GroupScheduleDTO[]> {
  const res = await apiClient.get<GroupScheduleDTO[]>(`/courses/${courseId}/groups/${groupId}/schedules`)
  return res.data
}

export async function addSchedule(courseId: string, groupId: string, input: CreateGroupScheduleInput): Promise<GroupScheduleDTO> {
  const res = await apiClient.post<GroupScheduleDTO>(`/courses/${courseId}/groups/${groupId}/schedules`, input)
  return res.data
}

export async function deleteSchedule(courseId: string, groupId: string, scheduleId: string): Promise<void> {
  await apiClient.delete(`/courses/${courseId}/groups/${groupId}/schedules/${scheduleId}`)
}

export async function getMyGroup(courseId: string): Promise<GroupDTO> {
  const res = await apiClient.get<GroupDTO>(`/courses/${courseId}/my-group`)
  return res.data
}

export interface GroupDTO {
  id: string
  course_id: string
  org_id: string
  teacher_id?: string
  name: string
  created_at: string
  updated_at: string
}

export interface GroupScheduleDTO {
  id: string
  group_id: string
  day_of_week: number
  start_time: string
  end_time: string
  location: string
  created_at: string
}

export interface GroupMemberDTO {
  id: string
  group_id: string
  student_id: string
  org_id: string
  joined_at: string
}

export interface CreateGroupInput {
  name: string
  teacher_id?: string
}

export interface UpdateGroupInput {
  name?: string
  teacher_id?: string
}

export interface CreateGroupScheduleInput {
  day_of_week: number
  start_time: string
  end_time: string
  location?: string
}

export interface AddMemberInput {
  student_id: string
}

export interface AnnouncementDTO {
  id: string
  course_id: string
  org_id: string
  author_id: string
  title: string
  content: string
  created_at: string
  updated_at: string
}

export interface CreateAnnouncementInput {
  title: string
  content: string
}

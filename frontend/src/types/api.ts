export interface ApiEnvelope<T> {
  data: T
}

export interface PaginationMeta {
  page: number
  page_size: number
  total: number
}

export interface PaginatedResponse<T> {
  data: T[]
  meta: PaginationMeta
}

export interface ApiErrorDetail {
  code: string
  message: string
}

export interface ApiErrorResponse {
  error: ApiErrorDetail
}

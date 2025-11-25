export interface IPagination {
  page: number
  limit: number
}

export interface IPaginationResponse<T> {
  list: T[]
  total: number
  page: number
  limit: number
  totalPages: number
}

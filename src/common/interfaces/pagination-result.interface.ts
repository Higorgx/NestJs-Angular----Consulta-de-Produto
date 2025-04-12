// common/interfaces/pagination-result.interface.ts
export interface PaginationResult<T> {
  data: T[];
  total: number;
  page: number;
  lastPage: number;
}

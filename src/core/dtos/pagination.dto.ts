export class PaginationDTO<T> {
  page: number;
  limit: number;
  totalItems: number;
  totalPages: number;
  data: T;
}

export interface ApiResponseType {
  status: number;
  error: boolean;
  data: any;
  message: string;
  pagination?: PaginationType;
}

export interface PaginationType {
  page: number;
  pageSize: number;
  totalRecord: number;
  totalPage: number;
}

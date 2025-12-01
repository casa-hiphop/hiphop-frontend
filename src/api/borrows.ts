import { Fetcher } from ".";

export interface IBorrow {
  id: string;
  tool_id: string;
  unit_id: string;
  requester_id: string;
  date: string;
  return_date: string;
  returned_at: string | null;
  created_at: string;
  updated_at: string;
  // Relacionamentos opcionais
  tool?: {
    id: string;
    name: string;
    brand: string;
  };
  unit?: {
    id: string;
    name: string;
    city: string;
    state: string;
  };
  requester?: {
    id: string;
    name: string;
    email: string;
    phone: string;
  };
}

export interface ICreateBorrowRequest {
  tool_id: string;
  unit_id: string;
  requester_id: string;
  date: string;
  return_date: string;
}

export interface IUpdateBorrowRequest {
  tool_id?: string;
  unit_id?: string;
  requester_id?: string;
  date?: string;
  return_date?: string;
}

export interface IBorrowsResponse {
  borrows: IBorrow[];
}

export interface IBorrowResponse {
  borrow: IBorrow;
}

export interface BorrowsApiInterface {
  getAll(): Promise<IBorrowsResponse>;
  getById(id: string): Promise<IBorrowResponse>;
  getPending(): Promise<IBorrowsResponse>;
  getOverdue(): Promise<IBorrowsResponse>;
  getAvailableForReturn(): Promise<IBorrowsResponse>;
  getByTool(tool_id: string): Promise<IBorrowsResponse>;
  create(data: ICreateBorrowRequest): Promise<{ message: string }>;
  update(id: string, data: IUpdateBorrowRequest): Promise<{ message: string }>;
  returnBorrow(id: string, returned_at?: string): Promise<{ message: string }>;
  delete(id: string): Promise<{ message: string }>;
}

export class BorrowsApi implements BorrowsApiInterface {
  private fetcher: Fetcher;

  constructor(fetcher: Fetcher) {
    this.fetcher = fetcher;
  }

  async getAll() {
    return this.fetcher<IBorrowsResponse>({
      url: "/borrows",
      method: "GET",
    });
  }

  async getById(id: string) {
    return this.fetcher<IBorrowResponse>({
      url: `/borrows/${id}`,
      method: "GET",
    });
  }

  async getPending() {
    return this.fetcher<IBorrowsResponse>({
      url: "/borrows/pending",
      method: "GET",
    });
  }

  async getOverdue() {
    return this.fetcher<IBorrowsResponse>({
      url: "/borrows/overdue",
      method: "GET",
    });
  }

  async getAvailableForReturn() {
    return this.fetcher<IBorrowsResponse>({
      url: "/borrows/available-for-return",
      method: "GET",
    });
  }

  async getByTool(tool_id: string) {
    return this.fetcher<IBorrowsResponse>({
      url: `/borrows/tool/${tool_id}`,
      method: "GET",
    });
  }

  async create(data: ICreateBorrowRequest) {
    return this.fetcher<{ message: string }>({
      url: "/borrows",
      method: "POST",
      body: data,
    });
  }

  async update(id: string, data: IUpdateBorrowRequest) {
    return this.fetcher<{ message: string }>({
      url: `/borrows/${id}`,
      method: "PUT",
      body: data,
    });
  }

  async returnBorrow(id: string, returned_at?: string) {
    return this.fetcher<{ message: string }>({
      url: `/borrows/${id}/return`,
      method: "PATCH",
      body: returned_at ? { returned_at } : {},
    });
  }

  async delete(id: string) {
    return this.fetcher<{ message: string }>({
      url: `/borrows/${id}`,
      method: "DELETE",
    });
  }
}

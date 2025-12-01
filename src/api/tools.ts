import { Fetcher } from ".";

export interface ITool {
  id: string;
  name: string;
  description: string;
  brand: string;
  quantity: number;
  created_at: string;
  updated_at: string;
}

export interface ICreateToolRequest {
  name: string;
  description: string;
  brand: string;
  quantity: number;
}

export interface IUpdateToolRequest {
  name?: string;
  description?: string;
  brand?: string;
  quantity?: number;
}

export interface ToolsApiInterface {
  getAll(): Promise<ITool[]>;
  getById(id: string): Promise<ITool>;
  create(data: ICreateToolRequest): Promise<{ message: string }>;
  update(id: string, data: IUpdateToolRequest): Promise<{ message: string }>;
  delete(id: string): Promise<{ message: string }>;
}

export class ToolsApi implements ToolsApiInterface {
  private fetcher: Fetcher;

  constructor(fetcher: Fetcher) {
    this.fetcher = fetcher;
  }

  async getAll() {
    return this.fetcher<ITool[]>({
      url: "/tools",
      method: "GET",
    });
  }

  async getById(id: string) {
    return this.fetcher<ITool>({
      url: `/tools/${id}`,
      method: "GET",
    });
  }

  async create(data: ICreateToolRequest) {
    return this.fetcher<{ message: string }>({
      url: "/tools",
      method: "POST",
      body: data,
    });
  }

  async update(id: string, data: IUpdateToolRequest) {
    return this.fetcher<{ message: string }>({
      url: `/tools/${id}`,
      method: "PUT",
      body: data,
    });
  }

  async delete(id: string) {
    return this.fetcher<{ message: string }>({
      url: `/tools/${id}`,
      method: "DELETE",
    });
  }
}

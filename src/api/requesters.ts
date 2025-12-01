import { Fetcher } from ".";

export interface IRequester {
  id: string;
  name: string;
  email: string;
  phone: string;
  created_at: string;
  updated_at: string;
}

export interface ICreateRequesterRequest {
  name: string;
  email: string;
  phone: string;
}

export interface IUpdateRequesterRequest {
  name: string;
  email: string;
  phone: string;
}

export interface IRequestersResponse {
  requesters: IRequester[];
}

export interface IRequesterResponse {
  requester: IRequester;
}

export interface RequestersApiInterface {
  getAll(): Promise<IRequestersResponse>;
  getById(id: string): Promise<IRequesterResponse>;
  create(data: ICreateRequesterRequest): Promise<{ message: string }>;
  update(
    id: string,
    data: IUpdateRequesterRequest
  ): Promise<{ message: string }>;
  delete(id: string): Promise<{ message: string }>;
}

export class RequestersApi implements RequestersApiInterface {
  private fetcher: Fetcher;

  constructor(fetcher: Fetcher) {
    this.fetcher = fetcher;
  }

  async getAll() {
    return this.fetcher<IRequestersResponse>({
      url: "/requesters",
      method: "GET",
    });
  }

  async getById(id: string) {
    return this.fetcher<IRequesterResponse>({
      url: `/requesters/${id}`,
      method: "GET",
    });
  }

  async create(data: ICreateRequesterRequest) {
    return this.fetcher<{ message: string }>({
      url: "/requesters",
      method: "POST",
      body: data,
    });
  }

  async update(id: string, data: IUpdateRequesterRequest) {
    return this.fetcher<{ message: string }>({
      url: `/requesters/${id}`,
      method: "PUT",
      body: data,
    });
  }

  async delete(id: string) {
    return this.fetcher<{ message: string }>({
      url: `/requesters/${id}`,
      method: "DELETE",
    });
  }
}

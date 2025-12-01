import { Fetcher } from ".";

export interface IUnit {
  id: string;
  name: string;
  description: string;
  cep: string;
  street: string;
  neighborhood: string;
  city: string;
  state: string;
  number: string;
  created_at: string;
  updated_at: string;
}

export interface ICreateUnitRequest {
  name: string;
  description: string;
  cep: string;
  number: string;
}

export interface IUpdateUnitRequest {
  name: string;
  description: string;
  cep: string;
  number: string;
}

export interface IUnitsResponse {
  units: IUnit[];
}

export interface IUnitResponse {
  unit: IUnit;
}

export interface UnitsApiInterface {
  getAll(): Promise<IUnitsResponse>;
  getById(id: string): Promise<IUnitResponse>;
  create(data: ICreateUnitRequest): Promise<{ message: string }>;
  update(id: string, data: IUpdateUnitRequest): Promise<{ message: string }>;
  delete(id: string): Promise<{ message: string }>;
}

export class UnitsApi implements UnitsApiInterface {
  private fetcher: Fetcher;

  constructor(fetcher: Fetcher) {
    this.fetcher = fetcher;
  }

  async getAll() {
    return this.fetcher<IUnitsResponse>({
      url: "/units",
      method: "GET",
    });
  }

  async getById(id: string) {
    return this.fetcher<IUnitResponse>({
      url: `/units/${id}`,
      method: "GET",
    });
  }

  async create(data: ICreateUnitRequest) {
    return this.fetcher<{ message: string }>({
      url: "/units",
      method: "POST",
      body: data,
    });
  }

  async update(id: string, data: IUpdateUnitRequest) {
    return this.fetcher<{ message: string }>({
      url: `/units/${id}`,
      method: "PUT",
      body: data,
    });
  }

  async delete(id: string) {
    return this.fetcher<{ message: string }>({
      url: `/units/${id}`,
      method: "DELETE",
    });
  }
}

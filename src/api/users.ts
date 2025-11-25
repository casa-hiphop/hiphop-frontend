import { IUserLogged } from "@/dtos/login"
import { Fetcher, IResponse } from "."

export interface IUpdateUserProps {
  name: string
}

export interface UsersApiInterface {
  getMe(): Promise<IResponse<IUserLogged>>
}

export class UsersApi implements UsersApiInterface {
  private fetcher: Fetcher

  constructor(fetcher: Fetcher) {
    this.fetcher = fetcher
  }

  async getMe() {
    return this.fetcher<IResponse<IUserLogged>>({
      url: '/users/me',
      method: 'GET',
    })
  }
}

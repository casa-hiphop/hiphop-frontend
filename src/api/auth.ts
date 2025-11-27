import { IUserLogged } from "@/dtos/login"
import { Fetcher, IResponse } from "."

export interface AuthApiInterface {
  login(email: string, password: string): Promise<IUserLogged>
  forgetPassword(email: string): Promise<IResponse>
  resetPassword(password: string, token: string): Promise<IResponse>
  register(name: string, email: string, password: string): Promise<IResponse>
}

export class AuthApi implements AuthApiInterface {
  private fetcher: Fetcher

  constructor(fetcher: Fetcher) {
    this.fetcher = fetcher
  }

  async login(email: string, password: string) {
    return this.fetcher<IUserLogged>({
      url: '/login',
      method: 'POST',
      body: { email, password },
    })
  }

  async register(name: string, email: string, password: string) {
    return this.fetcher<IResponse<IUserLogged>>({
      url: '/users',
      method: 'POST',
      body: { name, email, password },
    })
  }

  async forgetPassword(email: string) {
    return this.fetcher<IResponse>({
      url: '/forgot-password',
      method: 'POST',
      body: { email },
    })
  }

  async resetPassword(password: string, token: string) {
    return this.fetcher<IResponse>({
      url: `/reset-password/${token}`,
      method: 'PATCH',
      body: { password },
    })
  }
}

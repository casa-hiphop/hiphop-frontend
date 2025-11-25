import { AuthApi, AuthApiInterface } from './auth'
import { UsersApi, UsersApiInterface } from './users'

interface IFetcherProps {
  url: string
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH'
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  body?: Record<string, any> | FormData
  file?: File
  responseType?: 'json' | 'blob' | 'text'
}

export interface IResponse<T = object> {
  statusCode?: number
  message: string
  data: T
}

export type Fetcher = <T>(params: IFetcherProps) => Promise<T>

const apiUrl = process.env.NEXT_PUBLIC_API_URL

class Api {
  private fetcher = async <T>({
    url,
    method = 'GET',
    body,
    file,
    responseType = 'json',
  }: IFetcherProps): Promise<T> => {
    const headers: HeadersInit = {}
    let finalBody: BodyInit | undefined

    if (file) {
      const formData = new FormData()
      formData.append('file', file)
      if (body && typeof body === 'object') {
        Object.entries(body).forEach(([key, value]) => {
          if (value !== undefined && value !== null) {
            formData.append(key, String(value))
          }
        })
      }
      finalBody = formData
    } else if (body) {
      headers['Content-Type'] = 'application/json'
      finalBody = JSON.stringify(body)
    }

    const res = await fetch(`${apiUrl}${url}`, {
      method,
      headers,
      body: finalBody,
      credentials: 'include',
    })

    if (!res.ok) {
      const error = await res.json().catch(() => ({}))
      throw new Error(error.message || 'Erro na requisição')
    }

    switch (responseType) {
      case 'blob':
        return (await res.blob()) as T
      case 'text':
        return (await res.text()) as T
      case 'json':
      default:
        return await res.json()
    }
  }

  auth: AuthApiInterface
  users: UsersApiInterface

  constructor() {
    this.auth = new AuthApi(this.fetcher)
    this.users = new UsersApi(this.fetcher)
  }
}

const api = new Api()

export { api, apiUrl }

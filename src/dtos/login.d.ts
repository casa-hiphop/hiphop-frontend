export interface IUserLogged {
  id: string,
  name: string,
  email: string,
  avatar: string | null,
  status: boolean,
  created_at: string,
  updated_at: string | null,
  custom_link_slug: string
}

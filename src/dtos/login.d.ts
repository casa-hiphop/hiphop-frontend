export interface IUserLogged {
  user: {
    id: string;
    email: string;
    name: string;
    status: boolean;
  };
  token: string;
}

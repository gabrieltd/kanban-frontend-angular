export interface Auth {
  ok: boolean;
  token: string;
  user: {
    id: string;
    username: string;
    email: string;
  };
}

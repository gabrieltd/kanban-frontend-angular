export interface Auth {
  ok: boolean;
  token: string;
  user: {
    id: string;
    email: string;
    username: string;
    image: string;
    bio: string;
  };
}

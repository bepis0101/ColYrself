export type User = {
  id: string;
  username: string;
  email: string;
}

export type Register = {
  email: string;
  username: string;
  password: string;
  repeatPassword: string;
}
export interface User {
  id?: string;
  name: string;
  email: string;
  role: "admin" | "sub_admin";
  password: string;
  status: boolean;
}

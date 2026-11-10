export type Role = 'admin' | 'cliente' | 'invitado';

export interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
}

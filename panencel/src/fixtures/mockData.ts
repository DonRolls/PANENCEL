import { User } from '../models/user';

export const GUEST_USER: User = {
  id: 'guest',
  name: 'Invitado',
  email: '',
  role: 'invitado',
};

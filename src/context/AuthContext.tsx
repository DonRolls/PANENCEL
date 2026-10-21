import React, { createContext, useContext, useMemo, useState } from 'react';
import { GUEST_USER, INITIAL_USERS } from '../data/mockData';
import { AuthResult, User } from '../types';

interface AuthContextValue {
  user: User | null;
  login: (email: string, password: string) => AuthResult;
  register: (name: string, email: string, password: string) => AuthResult;
  loginAsGuest: () => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  // "Base de datos" en memoria: se reinicia al cerrar la app.
  const [users, setUsers] = useState<User[]>(INITIAL_USERS);
  const [user, setUser] = useState<User | null>(null);

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      login: (email, password) => {
        const found = users.find(
          (u) => u.email.toLowerCase() === email.trim().toLowerCase() && u.password === password,
        );
        if (!found) return { ok: false, message: 'Correo o contraseña incorrectos.' };
        setUser(found);
        return { ok: true };
      },
      register: (name, email, password) => {
        const exists = users.some((u) => u.email.toLowerCase() === email.trim().toLowerCase());
        if (exists) return { ok: false, message: 'Ya existe una cuenta con ese correo.' };
        const newUser: User = {
          id: `u${users.length + 1}`,
          name: name.trim(),
          email: email.trim().toLowerCase(),
          password,
          role: 'cliente',
        };
        setUsers((prev) => [...prev, newUser]);
        setUser(newUser);
        return { ok: true };
      },
      loginAsGuest: () => setUser(GUEST_USER),
      logout: () => setUser(null),
    }),
    [user, users],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth debe usarse dentro de <AuthProvider>');
  return ctx;
}

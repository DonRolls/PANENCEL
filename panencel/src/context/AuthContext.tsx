import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { Session } from '@supabase/supabase-js';
import { GUEST_USER } from '../fixtures/mockData';
import { AuthResult } from '../models/resultado-autenticacion';
import { Role, User } from '../models/user';
import { supabase } from '../supabase/client';

interface AuthContextValue {
  user: User | null;
  loading: boolean;
  authError: string;
  login: (email: string, password: string) => Promise<AuthResult>;
  register: (name: string, email: string, password: string) => Promise<AuthResult>;
  loginAsGuest: () => void;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [sessionLoaded, setSessionLoaded] = useState(!supabase);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(Boolean(supabase));
  const [authError, setAuthError] = useState(
    supabase
      ? ''
      : 'Configura EXPO_PUBLIC_SUPABASE_URL y EXPO_PUBLIC_SUPABASE_ANON_KEY en panencel/.env.local.',
  );

  useEffect(() => {
    if (!supabase) {
      return;
    }

    let mounted = true;
    let receivedAuthEvent = false;
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, nextSession) => {
      receivedAuthEvent = true;
      if (mounted) {
        setSession(nextSession);
        setSessionLoaded(true);
        setAuthError('');
        setLoading(Boolean(nextSession));
        if (!nextSession) setUser(null);
      }
    });

    void supabase.auth
      .getSession()
      .then(({ data, error }) => {
        if (!mounted) return;
        if (error) {
          setAuthError(error.message);
          setSessionLoaded(true);
          setLoading(false);
          return;
        }
        if (!receivedAuthEvent) {
          setSession(data.session);
          if (!data.session) {
            setUser(null);
            setLoading(false);
          }
        }
        setSessionLoaded(true);
      })
      .catch((cause: unknown) => {
        if (!mounted) return;
        setAuthError(
          cause instanceof Error ? cause.message : 'No se pudo restaurar la sesión.',
        );
        setSessionLoaded(true);
        setLoading(false);
      });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  useEffect(() => {
    if (!sessionLoaded || !session || !supabase) return;

    let active = true;
    void (async () => {
      try {
        const { data, error } = await supabase
          .from('profiles')
          .select('id, full_name, role')
          .eq('id', session.user.id)
          .single();
        if (!active) return;
        if (error) {
          setAuthError(`No se pudo cargar el perfil: ${error.message}`);
          setUser(null);
          setLoading(false);
          return;
        }

        const role: Role = data.role === 'admin' ? 'admin' : 'cliente';
        setUser({
          id: data.id,
          name: data.full_name,
          email: session.user.email ?? '',
          role,
        });
        setAuthError('');
        setLoading(false);
      } catch (cause) {
        if (!active) return;
        setAuthError(
          cause instanceof Error
            ? `No se pudo cargar el perfil: ${cause.message}`
            : 'No se pudo cargar el perfil.',
        );
        setUser(null);
        setLoading(false);
      }
    })();

    return () => {
      active = false;
    };
  }, [session, sessionLoaded]);

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      loading,
      authError,
      login: async (email, password) => {
        if (!supabase) {
          return {
            ok: false,
            message:
              'Configura Supabase en panencel/.env.local antes de iniciar sesión.',
          };
        }
        const { error } = await supabase.auth.signInWithPassword({
          email: email.trim(),
          password,
        });
        if (error) return { ok: false, message: error.message };
        setAuthError('');
        return { ok: true };
      },
      register: async (name, email, password) => {
        if (!supabase) {
          return {
            ok: false,
            message:
              'Configura Supabase en panencel/.env.local antes de crear una cuenta.',
          };
        }
        const { data, error } = await supabase.auth.signUp({
          email: email.trim(),
          password,
          options: { data: { full_name: name.trim() } },
        });
        if (error) return { ok: false, message: error.message };
        return {
          ok: true,
          message: data.session
            ? 'Tu cuenta se creó correctamente.'
            : 'Cuenta creada. Revisa tu correo para confirmar el registro.',
        };
      },
      loginAsGuest: () => {
        setAuthError('');
        setUser(GUEST_USER);
      },
      logout: async () => {
        if (user?.role === 'invitado') {
          setUser(null);
          return;
        }
        if (!supabase) throw new Error('La configuración de Supabase no está disponible.');
        const { error } = await supabase.auth.signOut();
        if (error) throw error;
        setUser(null);
      },
    }),
    [authError, loading, user],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth debe usarse dentro de <AuthProvider>');
  return ctx;
}

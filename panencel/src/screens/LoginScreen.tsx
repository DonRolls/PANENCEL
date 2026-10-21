import React, { useState } from 'react';
import { KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, View } from 'react-native';
import { AppButton } from '../components/AppButton';
import { AppInput } from '../components/AppInput';
import { useAuth } from '../context/AuthContext';
import { colors, spacing } from '../theme';

interface Props {
  onGoRegister: () => void;
}

export function LoginScreen({ onGoRegister }: Props) {
  const { login, loginAsGuest } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = () => {
    if (!email.trim() || !password) {
      setError('Ingresa tu correo y contraseña.');
      return;
    }
    const result = login(email, password);
    if (!result.ok) setError(result.message);
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'android' ? 'height' : 'padding'}
    >
      <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
        <Text style={styles.logo}>🥖</Text>
        <Text style={styles.title}>PANENCEL</Text>
        <Text style={styles.subtitle}>Inicia sesión para hacer tu pedido</Text>

        <AppInput
          label="Correo electrónico"
          placeholder="correo@ejemplo.com"
          keyboardType="email-address"
          value={email}
          onChangeText={(t) => {
            setEmail(t);
            setError('');
          }}
        />
        <AppInput
          label="Contraseña"
          placeholder="••••••"
          secure
          value={password}
          onChangeText={(t) => {
            setPassword(t);
            setError('');
          }}
        />

        {!!error && <Text style={styles.error}>{error}</Text>}

        <View style={{ gap: spacing.sm, marginTop: spacing.sm }}>
          <AppButton title="Iniciar sesión" onPress={handleLogin} />
          <AppButton title="Crear cuenta" variant="outline" onPress={onGoRegister} />
          <AppButton title="Explorar como invitado" variant="link" onPress={loginAsGuest} />
        </View>

        <View style={styles.hint}>
          <Text style={styles.hintTitle}>Cuentas de prueba</Text>
          <Text style={styles.hintText}>admin@panencel.com / admin123</Text>
          <Text style={styles.hintText}>cliente@panencel.com / cliente123</Text>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flexGrow: 1, justifyContent: 'center', padding: spacing.lg },
  logo: { fontSize: 64, textAlign: 'center' },
  title: {
    fontSize: 32,
    fontWeight: '800',
    color: colors.primary,
    textAlign: 'center',
    letterSpacing: 2,
  },
  subtitle: { color: colors.muted, textAlign: 'center', marginBottom: spacing.lg },
  error: { color: colors.danger, marginBottom: spacing.sm },
  hint: {
    marginTop: spacing.lg,
    padding: spacing.md,
    borderRadius: 12,
    backgroundColor: '#F6E9D8',
  },
  hintTitle: { fontWeight: '700', color: colors.text, marginBottom: 4 },
  hintText: { color: colors.muted },
});

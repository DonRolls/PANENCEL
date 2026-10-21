import React, { useState } from 'react';
import { KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, View } from 'react-native';
import { AppButton } from '../components/AppButton';
import { AppInput } from '../components/AppInput';
import { useAuth } from '../context/AuthContext';
import { colors, spacing } from '../theme';

interface Props {
  onGoLogin: () => void;
}

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function RegisterScreen({ onGoLogin }: Props) {
  const { register } = useAuth();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [error, setError] = useState('');

  const handleRegister = () => {
    if (!name.trim()) return setError('Ingresa tu nombre.');
    if (!EMAIL_REGEX.test(email.trim())) return setError('Ingresa un correo válido.');
    if (password.length < 6) return setError('La contraseña debe tener al menos 6 caracteres.');
    if (password !== confirm) return setError('Las contraseñas no coinciden.');

    const result = register(name, email, password);
    if (!result.ok) setError(result.message);
  };

  const onChange = (setter: (v: string) => void) => (v: string) => {
    setter(v);
    setError('');
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'android' ? 'height' : 'padding'}
    >
      <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
        <Text style={styles.title}>Crear cuenta</Text>
        <Text style={styles.subtitle}>Regístrate para guardar tus pedidos</Text>

        <AppInput label="Nombre completo" placeholder="Tu nombre" autoCapitalize="words" value={name} onChangeText={onChange(setName)} />
        <AppInput label="Correo electrónico" placeholder="correo@ejemplo.com" keyboardType="email-address" value={email} onChangeText={onChange(setEmail)} />
        <AppInput label="Contraseña" placeholder="Mínimo 6 caracteres" secure value={password} onChangeText={onChange(setPassword)} />
        <AppInput label="Confirmar contraseña" placeholder="Repite tu contraseña" secure value={confirm} onChangeText={onChange(setConfirm)} />

        {!!error && <Text style={styles.error}>{error}</Text>}

        <View style={{ gap: spacing.sm, marginTop: spacing.sm }}>
          <AppButton title="Registrarme" onPress={handleRegister} />
          <AppButton title="Ya tengo cuenta" variant="link" onPress={onGoLogin} />
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flexGrow: 1, justifyContent: 'center', padding: spacing.lg },
  title: { fontSize: 28, fontWeight: '800', color: colors.primary, textAlign: 'center' },
  subtitle: { color: colors.muted, textAlign: 'center', marginBottom: spacing.lg },
  error: { color: colors.danger, marginBottom: spacing.sm },
});

import { StatusBar } from 'expo-status-bar';
import React, { useEffect, useState } from 'react';
import { BackHandler } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { AuthProvider, useAuth } from './src/context/AuthContext';
import { LoginScreen } from './src/screens/LoginScreen';
import { MenuScreen } from './src/screens/MenuScreen';
import { RegisterScreen } from './src/screens/RegisterScreen';
import { colors } from './src/theme';

type AuthRoute = 'login' | 'register';

function Root() {
  const { user } = useAuth();
  const [route, setRoute] = useState<AuthRoute>('login');

  // Botón "atrás" de Android: de Registro vuelve a Login.
  useEffect(() => {
    const sub = BackHandler.addEventListener('hardwareBackPress', () => {
      if (!user && route === 'register') {
        setRoute('login');
        return true;
      }
      return false;
    });
    return () => sub.remove();
  }, [user, route]);

  if (user) return <MenuScreen />;
  return route === 'login' ? (
    <LoginScreen onGoRegister={() => setRoute('register')} />
  ) : (
    <RegisterScreen onGoLogin={() => setRoute('login')} />
  );
}

export default function App() {
  return (
    <SafeAreaProvider>
      <AuthProvider>
        <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>
          <StatusBar style="dark" />
          <Root />
        </SafeAreaView>
      </AuthProvider>
    </SafeAreaProvider>
  );
}

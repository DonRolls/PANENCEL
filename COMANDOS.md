# PANENCEL – Comandos

```bash
node -v                      # recomendado 22.13+ (LTS)
npx create-expo-app@latest panencel --template blank-typescript
cd panencel
npx expo install expo@^57.0.0 --fix
npx expo install react-native-safe-area-context
npx expo-doctor
```

Copia `App.tsx` (reemplaza) y la carpeta `src/` dentro de `panencel/`, luego:

```bash
adb devices
npx expo start --android
```

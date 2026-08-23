import { Stack } from 'expo-router';
import { AuthProvider } from '../context/AuthContext';

import { CompareProvider } from '../context/CompareContext';

export default function RootLayout() {
  return (
    <AuthProvider>
      <CompareProvider>
        <Stack>
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen name="index" options={{ headerShown: false }} />
          <Stack.Screen name="(auth)" options={{ headerShown: false }} />
          <Stack.Screen name="product/[id]" options={{ headerShown: false }} />
        </Stack>
      </CompareProvider>
    </AuthProvider>
  );
}

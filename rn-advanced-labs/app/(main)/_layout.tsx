import { Stack } from 'expo-router';

export default function MainLayout() {
  return (
    <Stack
      screenOptions={{
        headerStyle: {
          backgroundColor: '#3b82f6',
        },
        headerTintColor: '#fff',
        headerTitleStyle: {
          fontWeight: 'bold',
        },
      }}
    >
      <Stack.Screen 
        name="home" 
        options={{ 
          title: 'RN Advanced Labs',
          headerShown: false, // L'écran home gère son propre header
        }} 
      />
      <Stack.Screen 
        name="tp1-profile-card" 
        options={{ 
          title: 'TP1 - Profile Card',
          presentation: 'modal',
        }} 
      />
      <Stack.Screen 
        name="TP3-forms" 
        options={{ 
          headerShown: false, // Les écrans de formulaires gèrent leurs propres headers
        }} 
      />
    </Stack>
  );
}
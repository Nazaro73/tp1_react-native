// App.tsx
import React from 'react';
import { SafeAreaView, StatusBar } from 'react-native';
import ProfileCardScreen from './app/tp1-profile-card/screens/ProfileCardScreen';

export default function App() {
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <StatusBar barStyle="dark-content" backgroundColor="#f8fafc" />
      <ProfileCardScreen />
    </SafeAreaView>
  );
}
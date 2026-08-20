import { useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import { NavigationContainer } from '@react-navigation/native';
import { AuthScreen } from './src/screens/AuthScreen';
import { MainTabs } from './src/navigation/MainTabs';

export default function App() {
  const [identifier, setIdentifier] = useState<string | null>(null);

  return (
    <>
      {identifier ? (
        <NavigationContainer>
          <MainTabs identifier={identifier} onLogout={() => setIdentifier(null)} />
        </NavigationContainer>
      ) : (
        <AuthScreen onAuthenticated={setIdentifier} />
      )}
      <StatusBar style="auto" />
    </>
  );
}

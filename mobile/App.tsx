import { useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import { AuthScreen } from './src/screens/AuthScreen';
import { WelcomeScreen } from './src/screens/WelcomeScreen';

export default function App() {
  const [identifier, setIdentifier] = useState<string | null>(null);

  return (
    <>
      {identifier ? (
        <WelcomeScreen identifier={identifier} onLogout={() => setIdentifier(null)} />
      ) : (
        <AuthScreen onAuthenticated={setIdentifier} />
      )}
      <StatusBar style="auto" />
    </>
  );
}

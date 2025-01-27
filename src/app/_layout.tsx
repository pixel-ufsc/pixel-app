// arquivo de entrada da aplicacao

import { router, Slot } from 'expo-router';
import { ClerkProvider, useAuth } from '@clerk/clerk-expo';
import { useEffect } from 'react';
import { ActivityIndicator } from 'react-native';
import { tokenCache } from '@/storage/tokenCache';
import { AppRegistry } from 'react-native';
import { DefaultTheme, PaperProvider } from 'react-native-paper';

const PUBLIC_CLERK_PUBLISHABLE_KEY = process.env
  .EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY as string;

function InitialLayout() {
  const { isSignedIn, isLoaded } = useAuth();

  useEffect(() => {
    console.log('aaaa isSignedIn', isSignedIn);

    if (!isLoaded) {
      return;
    }
    if (isSignedIn) {
      console.log('to logado vou pra oi mundo');
      router.replace('./(auth)');
    } else {
      console.log('isSignedIn', isSignedIn);
      router.replace('./(public)');
    }
  }, [isSignedIn]);

  return isLoaded ? (
    <Slot />
  ) : (
    <ActivityIndicator
      style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}
    />
  );
}

const theme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: '#6200ee', // botei isso aqui só pra testar
  },
};

export default function Layout() {
  return (
    <>
      <ClerkProvider
        publishableKey={PUBLIC_CLERK_PUBLISHABLE_KEY}
        tokenCache={tokenCache}
      >
        <PaperProvider theme={theme}>
          <InitialLayout />
        </PaperProvider>
      </ClerkProvider>
    </>
  );
}

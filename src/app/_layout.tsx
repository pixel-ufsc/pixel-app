// arquivo de entrada da aplicacao
import { router, Slot } from 'expo-router';
import { ClerkProvider, useAuth } from '@clerk/clerk-expo';
import React, { useEffect } from 'react';
import { ActivityIndicator } from 'react-native';
import { tokenCache } from '@/storage/tokenCache';
import { DefaultTheme, PaperProvider } from 'react-native-paper';
import AsyncStorage from '@react-native-async-storage/async-storage';

const PUBLIC_CLERK_PUBLISHABLE_KEY = process.env
  .EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY as string;

function InitialLayout() {
  const { isSignedIn, isLoaded, getToken } = useAuth();

  useEffect(() => {
    const fetchToken = async (): Promise<void> => {
      const token = await getToken({template: "supabase"})
      if (token) {
        await AsyncStorage.setItem("sessionToken", token)
      }
    }

    if (!isLoaded) {
      return;
    }
    if (isSignedIn) {
      console.log('to logado vou pra oi mundo');
      fetchToken();
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

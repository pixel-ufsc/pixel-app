import { tokenCache } from "@/storage/tokenCache";
import { ClerkProvider, useAuth } from "@clerk/clerk-expo";
import Constants from "expo-constants";
import { router, Slot, usePathname } from "expo-router";
import { useEffect } from "react";
import { ActivityIndicator } from "react-native";
import { DefaultTheme, PaperProvider } from "react-native-paper";

const PUBLIC_CLERK_PUBLISHABLE_KEY =
  (process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY as string) ||
  (Constants.expoConfig?.extra?.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY as string);

function InitialLayout() {
  const { isSignedIn, isLoaded } = useAuth();
  const pathname = usePathname();

  useEffect(() => {
    if (!isLoaded) return;
    // Só redireciona se estiver na raiz
    if (pathname === "/") {
      if (isSignedIn) {
        router.replace("./(auth)");
      } else {
        router.replace("./(public)");
      }
    }
  }, [isSignedIn, isLoaded, pathname]);

  return isLoaded ? (
    <Slot />
  ) : (
    <ActivityIndicator
      style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
    />
  );
}

const theme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: "#6200ee",
  },
};

export default function Layout() {
  return (
    <ClerkProvider
      publishableKey={PUBLIC_CLERK_PUBLISHABLE_KEY}
      tokenCache={tokenCache}
    >
      <PaperProvider theme={theme}>
        <InitialLayout />
      </PaperProvider>
    </ClerkProvider>
  );
}

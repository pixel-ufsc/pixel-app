import messaging from "@react-native-firebase/messaging";

export async function getPushToken() {
  const authStatus = await messaging().requestPermission();
  const enabled =
    authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
    authStatus === messaging.AuthorizationStatus.PROVISIONAL;

  if (!enabled) return null;

  const token = await messaging().getToken();
  return token;
}

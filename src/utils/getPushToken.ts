import messaging, {
  AuthorizationStatus,
  getToken,
  requestPermission,
} from "@react-native-firebase/messaging";

export async function getPushToken() {
  const messagingInstance = messaging();
  const authStatus = await requestPermission(messagingInstance);
  const enabled =
    authStatus === AuthorizationStatus.AUTHORIZED ||
    authStatus === AuthorizationStatus.PROVISIONAL;

  if (!enabled) return null;

  const token = await getToken(messagingInstance);
  return token;
}

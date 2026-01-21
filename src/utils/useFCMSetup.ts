import messaging, {
  getInitialNotification,
  onMessage,
  onNotificationOpenedApp,
  setBackgroundMessageHandler,
} from "@react-native-firebase/messaging";
import * as Notifications from "expo-notifications";
import { useEffect } from "react";

Notifications.setNotificationHandler({
  handleNotification: async (): Promise<Notifications.NotificationBehavior> => {
    const behavior = {
      shouldShowAlert: true,
      shouldPlaySound: true,
      shouldSetBadge: true,
    } as Notifications.NotificationBehavior;

    return behavior;
  },
});

const useFCMSetup = () => {
  useEffect(() => {
    const messagingInstance = messaging();

    getInitialNotification(messagingInstance).then(async remoteMessage => {
      if (remoteMessage) {
        console.log(
          "Notification cause app to open from quit state:",
          remoteMessage.notification,
        );
      }
    });

    onNotificationOpenedApp(messagingInstance, remoteMessage => {
      console.log(
        "Notification caused app to open from background state:",
        remoteMessage.notification,
      );
    });

    setBackgroundMessageHandler(messagingInstance, async remoteMessage => {
      console.log("Message handled in the background:", remoteMessage);
    });

    const unsubscribe = onMessage(messagingInstance, async remoteMessage => {
      const title = remoteMessage.notification?.title || "Nova Mensagem";
      const body =
        remoteMessage.notification?.body || "Clique para ver os detalhes.";

      await Notifications.scheduleNotificationAsync({
        content: { title, body },
        trigger: null,
      });
    });

    return unsubscribe;
  }, []);
};

export default useFCMSetup;

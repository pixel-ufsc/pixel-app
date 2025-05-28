import React, { useState } from "react";
import { Image, ImageURISource, Pressable, View } from "react-native";
import HomeRoute from "./index";
import MembersRoute from "./members";
import NotificationsRoute from "./notifications";
import ProfileRoute from "./profile";

const TABS: {
  key: string;
  title: string;
  focusedIcon: ImageURISource;
  unfocusedIcon: ImageURISource;
}[] = [
  {
    key: "home",
    title: "Feed",
    focusedIcon: require("../../../assets/images/home-icon.png"),
    unfocusedIcon: require("../../../assets/images/home-icon-outline.png"),
  },
  {
    key: "members",
    title: "Membros",
    focusedIcon: require("../../../assets/images/groups-icon.png"),
    unfocusedIcon: require("../../../assets/images/groups-icon-outline.png"),
  },
  {
    key: "notifications",
    title: "Notificações",
    focusedIcon: require("../../../assets/images/favorite-icon.png"),
    unfocusedIcon: require("../../../assets/images/favorite-icon-outline.png"),
  },
  {
    key: "profile",
    title: "Perfil",
    focusedIcon: require("../../../assets/images/profile-icon.png"),
    unfocusedIcon: require("../../../assets/images/profile-icon-outline.png"),
  },
];

export default function AuthTabsLayout() {
  const [currentTab, setCurrentTab] = useState("home");

  const renderScreen = () => {
    switch (currentTab) {
      case "home":
        return <HomeRoute />;
      case "members":
        return <MembersRoute />;
      case "notifications":
        return <NotificationsRoute />;
      case "profile":
        return <ProfileRoute />;
    }
  };

  return (
    <View style={{ flex: 1 }}>
      <View style={{ flex: 1 }}>{renderScreen()}</View>

      <View
        style={{
          flexDirection: "row",
          height: 45,
          borderTopWidth: 1,
          borderColor: "#eee",
          backgroundColor: "#FAFAFA",
        }}
      >
        {TABS.map((tab) => {
          const isActive = currentTab === tab.key;
          return (
            <Pressable
              key={tab.key}
              onPress={() => setCurrentTab(tab.key)}
              style={{
                flex: 1,
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Image source={isActive ? tab.focusedIcon : tab.unfocusedIcon} />
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

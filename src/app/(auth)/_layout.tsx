import { Slot, usePathname, useRouter } from "expo-router";
import React from "react";
import { Image, Pressable, View } from "react-native";

const TABS = [
  {
    key: "home",
    title: "Feed",
    route: ".",
    focusedIcon: require("../../../assets/images/home-icon.png"),
    unfocusedIcon: require("../../../assets/images/home-icon-outline.png"),
  },
  {
    key: "members",
    title: "Membros",
    route: "members",
    focusedIcon: require("../../../assets/images/groups-icon.png"),
    unfocusedIcon: require("../../../assets/images/groups-icon-outline.png"),
  },
  {
    key: "new-post",
    title: "Nova Postagem",
    route: "new-post",
    focusedIcon: require("../../../assets/images/new-post-icon.png"),
    unfocusedIcon: require("../../../assets/images/new-post-icon.png"),
  },
  {
    key: "notifications",
    title: "Notificações",
    route: "notifications",
    focusedIcon: require("../../../assets/images/favorite-icon.png"),
    unfocusedIcon: require("../../../assets/images/favorite-icon-outline.png"),
  },
  {
    key: "profile",
    title: "Perfil",

    route: "profile",
    focusedIcon: require("../../../assets/images/profile-icon.png"),
    unfocusedIcon: require("../../../assets/images/profile-icon-outline.png"),
  },
] as const;

export default function AuthTabsLayout() {
  const router = useRouter();
  const pathname = usePathname();

  return (
    <View style={{ flex: 1 }}>
      <View style={{ flex: 1 }}>
        <Slot />
      </View>
      <View
        style={{
          flexDirection: "row",
          height: 45,
          borderTopWidth: 1,
          borderColor: "#eee",
          backgroundColor: "#FAFAFA",
        }}
      >
        {TABS.map(tab => {
          const isActive = pathname === tab.route;

          return (
            <Pressable
              key={tab.key}
              onPress={() => {
                if (!isActive) {
                  router.push(`./${tab.route}`);
                }
              }}
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

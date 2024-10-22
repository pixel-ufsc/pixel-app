import React from 'react';
import { BottomNavigation } from 'react-native-paper';
import { TabBarIcon } from '@/components/navigation/TabBarIcon';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import Home from '../pages/Home';
import Members from '../pages/Members';
import Notifications from '../pages/Notifications';
import Profile from '../pages/Profile';

const HomeRoute = () => <Home />;

const MembersRoute = () => <Members />;

const NotificationsRoute = () => <Notifications />;

const ProfileRoute = () => <Profile />;

export default function TabLayout() {
  const colorScheme = useColorScheme();
  const [index, setIndex] = React.useState(0);
  const [routes] = React.useState([
    {
      key: 'home',
      title: 'Home',
      focusedIcon: 'home',
      unfocusedIcon: 'home-outline',
    },
    {
      key: 'members',
      title: 'Membros',
      focusedIcon: 'account-group',
      unfocusedIcon: 'account-group-outline',
    },
    {
      key: 'notifications',
      title: 'Notificações',
      focusedIcon: 'bell',
      unfocusedIcon: 'bell-outline',
    },
    {
      key: 'profile',
      title: 'Perfil',
      focusedIcon: 'account',
      unfocusedIcon: 'account-outline',
    },
  ]);

  const renderScene = BottomNavigation.SceneMap({
    home: HomeRoute,
    members: MembersRoute,
    notifications: NotificationsRoute,
    profile: ProfileRoute,
  });

  return (
    <BottomNavigation
      navigationState={{ index, routes }}
      onIndexChange={setIndex}
      renderScene={renderScene}
      activeColor={Colors[colorScheme ?? 'light'].tint}
      shifting={false}
      barStyle={{ backgroundColor: Colors[colorScheme ?? 'light'].background }}
    />
  );
}

/* IMPLEMENTAÇÃO ANTIGA DO TEMPLATE PADRÃO EXPO */
// import { Tabs } from 'expo-router';
// import React from 'react';

// import { TabBarIcon } from '@/components/navigation/TabBarIcon';
// import { Colors } from '@/constants/Colors';
// import { useColorScheme } from '@/hooks/useColorScheme';

// export default function TabLayout() {
//   const colorScheme = useColorScheme();

//   return (
//     <Tabs
//       screenOptions={{
//         tabBarActiveTintColor: Colors[colorScheme ?? 'light'].tint,
//         headerShown: false,
//       }}
//     >
//       <Tabs.Screen
//         name='index'
//         options={{
//           title: 'Home',
//           tabBarIcon: ({ color, focused }) => (
//             <TabBarIcon
//               name={focused ? 'home' : 'home-outline'}
//               color={color}
//             />
//           ),
//         }}
//       />
//       <Tabs.Screen
//         name='explore'
//         options={{
//           title: 'Explore',
//           tabBarIcon: ({ color, focused }) => (
//             <TabBarIcon
//               name={focused ? 'code-slash' : 'code-slash-outline'}
//               color={color}
//             />
//           ),
//         }}
//       />
//       <Tabs.Screen
//         name='settings'
//         options={{
//           title: 'Settings',
//           tabBarIcon: ({ color, focused }) => (
//             <TabBarIcon
//               name={focused ? 'settings' : 'settings-outline'}
//               color={color}
//             />
//           ),
//         }}
//       />
//     </Tabs>
//   );
// }

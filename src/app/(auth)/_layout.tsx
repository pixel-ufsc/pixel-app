import * as React from 'react';
import { BottomNavigation } from 'react-native-paper';

// https://pictogrammers.com/library/mdi/ icones podem ser pegos daqui

// rotas das paginas
import ProfileRoute from './profile';
import HomeRoute from './index';
import NotificationsRoute from './notifications';
import MembersRoute from './members';

export default function AuthTabsLayout() {
  const [index, setIndex] = React.useState(0);
  const [routes] = React.useState([
    {
      key: 'home',
      title: 'Feed',
      focusedIcon: 'home',
      unfocusedIcon: 'home-outline',
    },
    {
      key: 'members',
      title: 'Membros',
      focusedIcon: 'account-multiple',
      unfocusedIcon: 'account-multiple-outline',
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
      focusedIcon: 'account-circle',
      unfocusedIcon: 'account-circle-outline',
    },
  ]);

  const renderScene = BottomNavigation.SceneMap({
    home: HomeRoute,
    members: MembersRoute,
    profile: ProfileRoute,
    notifications: NotificationsRoute,
  });

  return (
    <BottomNavigation
      navigationState={{ index, routes }}
      onIndexChange={setIndex}
      renderScene={renderScene}
    />
  );
}

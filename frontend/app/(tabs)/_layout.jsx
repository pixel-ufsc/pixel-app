/* eslint-disable react/prop-types */
/* eslint-disable react/jsx-no-undef */
/* IMPLEMENTAÇÃO ANTIGA DO TEMPLATE PADRÃO EXPO */
import { Tabs } from 'expo-router';
import React from 'react';
import { Text, View } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons'; // Ícones do Material Design

const TabIcon = ({ icon, color, name, focused }) => {
  return (
    <View style={{ alignItems: 'center', justifyContent: 'center' }}>
      <MaterialCommunityIcons
        name={icon}
        size={24}
        color={color}
        style={{ marginBottom: 5, opacity: focused ? 1 : 0.5 }}
      />
      <Text
        style={{ color, fontSize: 12, fontWeight: focused ? 'bold' : 'normal' }}
      >
        {name}
      </Text>
    </View>
  );
};

export default function TabLayout() {
  return (
    <>
      <Tabs
        screenOptions={{
          tabBarActiveTintColor: '#984ad4',
          tabBarInactiveTintColor: '#CDCDE0',
          tabBarShowLabel: false,
          tabBarStyle: {
            backgroundColor: '#161622',
            borderTopWidth: 1,
            borderTopColor: '#232533',
            height: 84,
          },
        }}
      >
        <Tabs.Screen
          name='home'
          options={{
            title: 'Home',
            headerShown: false,
            tabBarIcon: ({ color, focused }) => (
              <TabIcon
                icon='home-outline' // Usando um ícone de MaterialCommunityIcons
                color={color}
                name='Home'
                focused={focused}
              />
            ),
          }}
        />
        <Tabs.Screen
          name='members'
          options={{
            title: 'Membros',
            headerShown: false,
            tabBarIcon: ({ color, focused }) => (
              <TabIcon
                icon='account-group-outline'
                color={color}
                name='Membros'
                focused={focused}
              />
            ),
          }}
        />
        <Tabs.Screen
          name='notifications'
          options={{
            title: 'Notificações',
            headerShown: false,
            tabBarIcon: ({ color, focused }) => (
              <TabIcon
                icon='bell-outline'
                color={color}
                name='Notificações'
                focused={focused}
              />
            ),
          }}
        />
        <Tabs.Screen
          name='profile'
          options={{
            title: 'Perfil',
            headerShown: false,
            tabBarIcon: ({ color, focused }) => (
              <TabIcon
                icon='account-circle-outline'
                color={color}
                name='Perfil'
                focused={focused}
              />
            ),
          }}
        />
      </Tabs>
    </>
  );
}

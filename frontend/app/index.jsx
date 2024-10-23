/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable no-undef */
/* eslint-disable @typescript-eslint/no-require-imports */
/* eslint-disable react/prop-types */
import React from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';
import { Button } from 'react-native-paper';
import { router } from 'expo-router';

const Welcome = () => {
  const handleGoogleLogin = () => {
    console.log('Login com Google');
    router.push('/home');
  };

  return (
    <View style={styles.container}>
      <Image
        source={require('../assets/images/logoPnx.png')}
        style={styles.logo}
        resizeMode='contain'
      />
      <Text style={styles.title}>Pixel App</Text>
      <Text style={styles.description}>
        O aplicativo exclusivo da Pixel para você acompanhar as últimas
        novidades e conectar-se com a nossa comunidade.
      </Text>
      <Button
        mode='contained'
        onPress={handleGoogleLogin}
        icon='google'
        style={styles.loginButton}
        labelStyle={styles.loginButtonLabel}
      >
        Entrar com Google
      </Button>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  logo: {
    width: 400,
    height: 400,
    marginBottom: 50,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 10,
  },
  description: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 30,
    paddingHorizontal: 20,
  },
  loginButton: {
    width: '80%',
    backgroundColor: '#4285F4',
  },
  loginButtonLabel: {
    color: '#fff',
    fontSize: 16,
  },
});

export default Welcome;

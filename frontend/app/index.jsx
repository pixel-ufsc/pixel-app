/* eslint-disable no-undef */
/* eslint-disable @typescript-eslint/no-require-imports */
import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';
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
      <Text style={styles.description}>O seu companheiro da Pixel.</Text>
      <TouchableOpacity style={styles.googleButton} onPress={handleGoogleLogin}>
        <View style={styles.googleIconContainer}>
          <Image
            source={require('../assets/images/google-icon.png')}
            style={styles.googleIcon}
          />
        </View>
        <Text style={styles.googleButtonText}>Entrar com o Google</Text>
      </TouchableOpacity>
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
  googleButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 5,
    paddingVertical: 10,
    paddingHorizontal: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 3,
    width: '80%',
  },
  googleIconContainer: {
    width: 30,
    height: 30,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 20,
  },
  googleIcon: {
    width: 40,
    height: 40,
  },
  googleButtonText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
  },
});

export default Welcome;

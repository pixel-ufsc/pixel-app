import { Button } from '@/components/Button';
import { useAuth, useUser } from '@clerk/clerk-expo';
import { View, Text, StyleSheet, Image } from 'react-native';

export default function Home() {
  const { user } = useUser();

  const email = user?.primaryEmailAddress?.emailAddress;
  const isFromPixel = email?.endsWith('@ejpixel.com.br');

  return (
    <>
      <View style={styles.container}>
        <Image
          source={{ uri: user?.imageUrl }}
          style={{ width: 100, height: 100, borderRadius: 50 }}
        />
        <Text style={styles.text}>{user?.firstName}</Text>
        <Text style={{ marginBottom: 20 }}>Meu email é {email}</Text>
        {isFromPixel ? (
          <Text>Eu sou da Pixel #pas 😇</Text>
        ) : (
          <>
            <Text style={{ fontWeight: 300 }}>👾 Invadi o Pixel App 😎</Text>
            <Text style={{ fontWeight: 300 }}>
              Vou vazar print de vcs falando mal do Cancian{' '}
            </Text>
            <Text style={{ fontWeight: 300 }}>👿 👿 👿 </Text>
          </>
        )}
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 32,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 12,
  },
  text: {
    fontSize: 20,
    fontWeight: 'bold',
  },
});

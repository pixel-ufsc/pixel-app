import { View, Text, StyleSheet, Image } from 'react-native';
import { Button } from 'react-native-paper';
import { useAuth, useUser } from '@clerk/clerk-expo';

export default function Profile() {
  const { signOut } = useAuth();

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

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <View style={styles.container}>
        <Text>Tela de perfil</Text>
        <Button icon='logout' mode='contained' onPress={() => signOut()}>
          Sair
        </Button>
      </View>
    </View>
  );
}

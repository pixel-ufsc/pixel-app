import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { router } from 'expo-router';
import { styles } from './style';

type CardMembroProps = {
  id: string;
  nome: string;
  curso: string;
  imagem: string;
  membroDesde: string;
  role: string;
};

export default function CardMembro({ id, nome, curso, imagem, membroDesde, role }: CardMembroProps) {
  const handlePress = () => {
    router.push(`/profile?id=${id}`);
  };

  return (
    <TouchableOpacity style={styles.card} onPress={handlePress}>
      <Image source={{ uri: imagem }} style={styles.image} />
      <View style={styles.infoContainer}>
        <Text style={styles.name}>{nome}</Text>
        <Text style={styles.membersince}>Membro desde {membroDesde}</Text>
        <Text style={[styles.text, { marginTop: 10 }]}>Curso: {curso}</Text>
        <Text style={styles.text}>Cargo: {role}</Text>
      </View>
    </TouchableOpacity>
  );
}

import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { styles } from './style';

type CardMembroProps = {
  nome: string;
  curso: string;
  email: string;
  imagem: string;
  membroDesde: string;
};

export default function CardMembro({ nome, curso, email, imagem, membroDesde }: CardMembroProps) {
  return (
    
    <TouchableOpacity style={styles.card}>
      <Image source={{ uri: imagem }} style={styles.image} />
      <View style={styles.infoContainer}>
        <Text style={styles.name}>{nome}</Text>
        <Text style={styles.membersince}>Membro desde {membroDesde}</Text>
        <Text style={[styles.text, { marginTop: 10 }]}>Curso: {curso}</Text>
        <Text style={styles.text}>Email: {email}</Text>
      </View>
    </TouchableOpacity>
  );
}

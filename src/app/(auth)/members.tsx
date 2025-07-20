import { View, StyleSheet, FlatList, Text } from 'react-native';
import CardMembro from '../../components/MemberCard/index';

export default function Members() {
  const membros = [
    {
      id: '1',
      nome: 'Joana da Silva',
      curso: 'Sistemas de Informação',
      email: 'joana.silva@ufsc.com',
      imagem: 'https://images.unsplash.com/photo-1634130287199-7889bc37f7fe',
      membroDesde: '2024/2',
    },
    {
      id: '2',
      nome: 'Joana da Silva',
      curso: 'Sistemas de Informação',
      email: 'joana.silva@ufsc.com',
      imagem: 'https://images.unsplash.com/photo-1634130287199-7889bc37f7fe',
      membroDesde: '2024/2',
    },
    {
      id: '3',
      nome: 'Joana da Silva',
      curso: 'Sistemas de Informação',
      email: 'joana.silva@ufsc.com',
      imagem: 'https://images.unsplash.com/photo-1634130287199-7889bc37f7fe',
      membroDesde: '2024/2',
    },
    // outros membros...
  ];

  const Header = () => (
    <View style={styles.header}>
      <Text style={styles.titulo}>Nossos Membros</Text>
      <Text style={styles.subtitulo}>Saiba quais são os membros que fazem parte da Pixel atualmente</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={membros}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <CardMembro {...item} />}
        ListHeaderComponent={Header}
        contentContainerStyle={{ alignItems: 'center', paddingBottom: 16 }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingTop: 40,
  },
  header: {
    alignItems: 'flex-start',
    width: '100%',
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  titulo: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#693274',
  },
  subtitulo: {
    fontSize: 16,
    color: '#555',
  },
});

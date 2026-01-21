import { View, Text, Image, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { styles } from './style';

type NotificationCardProps = {
  id: string;
  postId: string;
  nome: string;
  acao: string;
  tempo: string;
  imagem: string | number; // Pode ser URI (string) ou require (number)
  onOpenPost: (postId: string) => void;
};

export default function NotificationCard({
  id,
  postId,
  nome,
  acao,
  tempo,
  imagem,
  onOpenPost,
}: NotificationCardProps) {
  const router = useRouter();

  const handlePressImage = () => {
    router.push(`/profile?id=${id}`);
  };

  return (
    <View style={styles.card} >
      <TouchableOpacity onPress={handlePressImage}>
        <Image source={typeof imagem === "string" ? { uri: imagem } : imagem} style={styles.image} />
      </TouchableOpacity>
      <TouchableOpacity style={{ flex: 1 }} onPress={() => onOpenPost(postId)}>
        <Text style={{ fontSize: 16 }}>
          <Text style={{ fontWeight: '600' }}>{nome}</Text> {acao} sua publicação.
        </Text>
        <Text style={{ color: '#555' }}>Há {tempo}</Text>
      </TouchableOpacity>
    </View>
  );
}

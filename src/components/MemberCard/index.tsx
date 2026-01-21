import { router } from "expo-router";
import { Image, Text, TouchableOpacity, View } from "react-native";
import { styles } from "./style";

type CardMembroProps = {
  id: string;
  nome: string;
  imagem: string | number; // Pode ser URI (string) ou require (number)
  membroDesde: string;
  role: string;
};

export default function CardMembro({
  id,
  nome,
  imagem,
  membroDesde,
  role,
}: CardMembroProps) {
  const handlePress = () => {
    router.push(`/profile?id=${id}`);
  };

  return (
    <TouchableOpacity
      style={styles.card}
      onPress={handlePress}
    >
      <Image
        source={typeof imagem === "string" ? { uri: imagem } : imagem}
        style={styles.image}
      />
      <View style={styles.infoContainer}>
        <Text style={styles.name}>{nome}</Text>
        <Text style={styles.membersince}>Membro desde {membroDesde}</Text>
        <Text style={[styles.text, { marginTop: 10 }]}>Cargo: {role}</Text>
      </View>
    </TouchableOpacity>
  );
}

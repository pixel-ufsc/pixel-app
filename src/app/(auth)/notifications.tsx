import ApiClient from "@/utils/api";
import { useAuth } from "@clerk/clerk-expo";
import { useState } from "react";
import { FlatList, StyleSheet, Text, View } from "react-native";
import MediaModal from "../../components/MediaModal";
import NotificationCard from "../../components/NotificationCard";

const mockNotifications = [
  {
    id: "1",
    nome: "João Silva",
    acao: "curtiu",
    tempo: "5 minutos",
    imagem:
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8cHJvZmlsZSUyMHBpY3xlbnwwfHwwfHx8Mg%3D%3D",
    postId: "681807b2cb80d2493b39a115",
  },
  {
    id: "2",
    nome: "Maria Souza",
    acao: "comentou",
    tempo: "10 minutos",
    imagem:
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8cHJvZmlsZSUyMHBpY3xlbnwwfHwwfHx8Mg%3D%3D",
    postId: "681807b2cb80d2493b39a115",
  },
  {
    id: "3",
    nome: "Carlos Lima",
    acao: "cometou",
    tempo: "20 minutos",
    imagem:
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8cHJvZmlsZSUyMHBpY3xlbnwwfHwwfHx8Mg%3D%3D",
    postId: "681807b2cb80d2493b39a115",
  },
  {
    id: "4",
    nome: "Ana Paula",
    acao: "curtiu",
    tempo: "30 minutos",
    imagem:
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8cHJvZmlsZSUyMHBpY3xlbnwwfHwwfHx8Mg%3D%3D",
    postId: "681807b2cb80d2493b39a115",
  },
];

interface Media {
  _id: string;
  description: string;
  url: string;
  createdAt: Date;
}

const fetchMediaById = async (postId: string, auth: any) => {
  try {
    const response = await ApiClient.get(`/medias/${postId}`, auth);
    return response;
  } catch (error) {
    console.error("Erro ao buscar media:", error);
    return null;
  }
};

export default function Notifications() {
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedMedia, setSelectedMedia] = useState<Media | null>(null);
  const auth = useAuth();

  const handleOpenPost = async (postId: string) => {
    console.log("handleOpenPost chamado com postId:", postId);
    const media = await fetchMediaById(postId, auth);
    console.log("media retornada:", media);
    setSelectedMedia(media);
    setModalVisible(true);
  };

  return (
    <View style={{ flex: 1, padding: 20 }}>
      <Text style={styles.titulo}>Notificações</Text>
      <FlatList
        data={mockNotifications}
        keyExtractor={item => item.postId}
        renderItem={({ item }) => (
          <NotificationCard
            id={item.id}
            postId={item.postId}
            nome={item.nome}
            acao={item.acao}
            tempo={item.tempo}
            imagem={item.imagem}
            onOpenPost={handleOpenPost}
          />
        )}
      />
      <MediaModal
        visible={modalVisible}
        media={selectedMedia}
        onClose={() => setModalVisible(false)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  titulo: {
    fontSize: 24,
    paddingBottom: 4,
    fontWeight: "bold",
    color: "#693274",
  },
});

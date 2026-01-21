import ApiClient from "@/utils/api";
import formatDate from "@/utils/date";
import { useAuth } from "@clerk/clerk-expo";
import { useEffect, useState } from "react";
import { ActivityIndicator, FlatList, StyleSheet, Text, View } from "react-native";
import MediaModal from "../../components/MediaModal";
import NotificationCard from "../../components/NotificationCard";

interface Notification {
  id: string;
  type: "like" | "comment";
  userId: string;
  userName: string;
  userImage?: string;
  postId: string;
  createdAt: Date | string;
}

interface Media {
  _id: string;
  description: string;
  url: string;
  createdAt: Date;
  totalLikes?: number;
  totalComments?: number;
  author?: {
    _id?: string;
    first_name?: string;
    last_name?: string;
    role?: string;
    profileImageUrl?: string;
  };
}

interface NotificationsResponse {
  data: Notification[];
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
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedMedia, setSelectedMedia] = useState<Media | null>(null);
  const auth = useAuth();

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        setLoading(true);
        const response = await ApiClient.get<NotificationsResponse>("/users/notifications", auth);
        setNotifications(response.data || []);
      } catch (error) {
        console.error("Erro ao buscar notificações:", error);
        setNotifications([]);
      } finally {
        setLoading(false);
      }
    };

    if (auth.isLoaded) {
      fetchNotifications();
    }
  }, [auth.isLoaded]);

  const handleOpenPost = async (postId: string) => {
    const media = await fetchMediaById(postId, auth);
    if (media) {
      setSelectedMedia(media);
      setModalVisible(true);
    }
  };

  const formatNotificationTime = (createdAt: Date | string): string => {
    const date = typeof createdAt === "string" ? new Date(createdAt) : createdAt;
    const now = new Date();
    return formatDate(date, now);
  };

  const getActionText = (type: string): string => {
    return type === "like" ? "curtiu" : "comentou";
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#693274" />
      </View>
    );
  }

  return (
    <View style={{ flex: 1, padding: 20 }}>
      <Text style={styles.titulo}>Notificações</Text>
      <FlatList
        data={notifications}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <NotificationCard
            id={item.userId}
            postId={item.postId}
            nome={item.userName}
            acao={getActionText(item.type)}
            tempo={formatNotificationTime(item.createdAt)}
            imagem={item.userImage || require("../../../assets/images/register-user-logo.png")}
            onOpenPost={handleOpenPost}
          />
        )}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>Nenhuma notificação</Text>
          </View>
        }
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
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  emptyText: {
    color: "#666",
    textAlign: "center",
    fontSize: 16,
  },
});

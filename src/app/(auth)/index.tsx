import FeedCard from "@/components/FeedCard";
import MediaModal from "@/components/MediaModal";
import ApiClient from "@/utils/api";
import { useAuth } from "@clerk/clerk-expo";
import { useEffect, useState } from "react";
import { FlatList, Pressable, StyleSheet, View } from "react-native";
import CommentModal from "@/components/CommentModal";

interface Media {
  _id: string;
  description: string;
  url: string;
  createdAt: Date;
}

export default function Home() {
  const [data, setData] = useState<Media[]>([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedMedia, setSelectedMedia] = useState<Media | null>(null);
  const [showComments, setShowComments] = useState(false);
  const [selectedPostId, setSelectedPostId] = useState<string | null>(null);
  
  const auth = useAuth();
  

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await ApiClient.get("/medias/?limit=20", auth);
        setData(response.data);

        console.log("data", response);
      } catch (error) {
        console.error("Erro ao buscar usuários:", error);
      }
    };

    fetchUserData();
  }, []);

  const selectMedia = (media: Media) => {
    setSelectedMedia(media);
    setIsModalVisible(true);
  };

  const closemodal = () => {
    console.log("closemodal");
    setSelectedMedia(null);
    setIsModalVisible(false);
  };

  const handleOpenComment = (postId: string) => {
    setSelectedPostId(postId);
    setShowComments(true);
  };

  const handleCloseComments = () => {
    setShowComments(false);
    setSelectedPostId(null);
  };

  useEffect(() => {
    console.log("selectedMedia", selectedMedia);
    console.log("isModalVisible", isModalVisible);
  }, [selectedMedia, isModalVisible]);

  return (
    <>
      <View style={styles.container}>
        <FlatList
          style={styles.feed}
          data={data}
          keyExtractor={item => item._id.toString()}
          renderItem={({ item }) => (
            <View style={styles.teste}>
              <Pressable onPress={() => selectMedia(item)}>
                <FeedCard
                  description={item.description}
                  url={item.url}
                  createdAt={item.createdAt}
                  onComment={() => handleOpenComment(item._id)}
                />
              </Pressable>
            </View>
          )}
        />
      </View>
      <MediaModal
        visible={isModalVisible}
        media={selectedMedia}
        onClose={closemodal}
        onComment={() => {
          if (selectedMedia) handleOpenComment(selectedMedia._id);
        }}
      />
      <CommentModal
        visible={showComments}
        onClose={handleCloseComments}
        postId={selectedPostId || ""}
        auth={auth}
      />
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#e9e5df",
    gap: 12,
  },
  text: {
    fontSize: 20,
    fontWeight: "bold",
  },
  feed: {
    width: "100%",
  },
  teste: {
    marginTop: 8,
    marginBottom: 8,
  },
  modalMedia: {
    height: "100%",
    width: "100%",
  },
});

const modalStyles = StyleSheet.create({
  userImage: {
    backgroundColor: "blue",
    height: 30,
    width: 30,
    borderRadius: 48,
  },
  userName: {
    color: "#fff",
    fontWeight: "600",
  },
  userRole: {
    color: "#fffdfdad",
    fontWeight: "400",
    fontSize: 12,
  },
  mediaDescription: {
    color: "#fff",
    marginTop: 8,
    fontSize: 12,
  },
  footerActions: {
    position: "absolute",
    bottom: 0,
    right: 0,
    padding: 10,
    zIndex: 2,
  },
  footerActionContainer: {
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    flexGrow: 1,
    padding: 8,
  },
  footerIcon: {
    width: 24,
    height: 24,
  },
  footerActionText: {
    color: "#fff",
    fontSize: 12,
  },
  gradient: {
    position: "absolute",
    bottom: 0,
    height: 400,
    width: "100%",
    zIndex: 1,
  },
});

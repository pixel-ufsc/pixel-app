import CommentModal from "@/components/CommentModal";
import FeedCard from "@/components/FeedCard";
import MediaModal from "@/components/MediaModal";
import ApiClient from "@/utils/api";
import { useAuth } from "@clerk/clerk-expo";
import { useEffect, useState } from "react";
import { FlatList, Pressable, StyleSheet, View } from "react-native";

interface Author {
  _id: string;
  first_name: string;
  last_name: string;
  role: string;
  profileImageUrl: string;
}

interface PostResponse {
  _id: string;
  isLiked?: boolean;
  description: string;
  url: string;
  createdAt: Date;
  totalLikes: number;
  totalComments: number;
  author: { // no começo autor é apenas um objeto com id
    _id: string;
  };
}

interface Media {
  _id: string;
  isLiked?: boolean;
  description: string;
  url: string;
  createdAt: Date;
  totalLikes: number;
  totalComments: number;
  author: Author;
}

export default function Home() {
  const [data, setData] = useState<Media[]>([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedMedia, setSelectedMedia] = useState<Media | null>(null);
  const [showComments, setShowComments] = useState(false);
  const [selectedPostId, setSelectedPostId] = useState<string | null>(null);

  const auth = useAuth();


  useEffect(() => {
    const fetchFeedData = async () => {
      try {
        const response = await ApiClient.get<{ data: PostResponse[] }>("/medias/?limit=20", auth);
        const postsOnly: PostResponse[] = response.data;

        const authorPromises = postsOnly.map((post: PostResponse) =>
          ApiClient.get<Author>(`/users/${post.author._id}`, auth)
        );

        const authors: Author[] = await Promise.all(authorPromises);

        const combinedData: Media[] = postsOnly.map((post, index) => {
          return {
            ...post,
            author: authors[index],
            isLiked: post.isLiked || false,
          };
        });

        setData(combinedData);

      } catch (error) {
        console.error("Erro ao buscar dados do feed:", error);
      }
    };

    if (auth.isLoaded) {
      fetchFeedData();
    }
  }, [auth.userId]);

  const handleLike = async (postId: string) => {
    const postOriginal = data.find(p => p._id === postId);
    if (!postOriginal) return; // caso o post não seja encontrado
    const seraCurtido = !postOriginal.isLiked;

    try {
      if (seraCurtido) {
        await ApiClient.post(`/medias/${postId}/like`, auth, {});
      } else {
        await ApiClient.delete(`/medias/${postId}/like`, auth);
      }
    } catch (error) {
      console.error("Erro ao processar o like/unlike:", error);
      //reverter o estado em caso de erro.
    }

    setData(currentData =>
      currentData.map(post => {
        if (post._id === postId) {
          const newTotalLikes = seraCurtido ? post.totalLikes + 1 : post.totalLikes - 1;
          return { ...post, isLiked: seraCurtido, totalLikes: newTotalLikes };
        }
        return post;
      })
    );
  };

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
                  id={item._id}
                  description={item.description}
                  isLiked={!!item.isLiked}
                  url={item.url}
                  createdAt={item.createdAt}
                  totalLikes={item.totalLikes}
                  totalComments={item.totalComments}
                  author={item.author}
                  onLike={() => handleLike(item._id)}
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

import CommentModal from "@/components/CommentModal";
import FeedCard from "@/components/FeedCard";
import MediaModal from "@/components/MediaModal";
import ApiClient from "@/utils/api";
import { useAuth } from "@clerk/clerk-expo";
import { useEffect, useState } from "react";
import { ActivityIndicator, FlatList, Pressable, StyleSheet, View } from "react-native";

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

interface CurrentUser {
  _id: string;
}

export default function Home() {
  const [data, setData] = useState<Media[]>([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedMedia, setSelectedMedia] = useState<Media | null>(null);
  const [showComments, setShowComments] = useState(false);
  const [selectedPostId, setSelectedPostId] = useState<string | null>(null);
  const [currentUserId, setCurrentUserId] = useState<string | undefined>(undefined);
  const [isMenuVisible, setIsMenuVisible] = useState(false);
  const [loading, setLoading] = useState(true);

  // Página atual do feed, usado para fazer o scroll infinito
  const [page, setPage] = useState(1);

  // Flag para evitar carregar mais de uma vez ao mesmo tempo
  const [loadingMore, setLoadingMore] = useState(false);

  const auth = useAuth();

  const fetchFeedData = async (pageNum = 1) => {
    try {
      // Se for a primeira página, mostrar loading
      if (pageNum === 1) {
        setLoading(true);
      }

      // Faz a requisicao de posts paginados
      const response = await ApiClient.get<{ data: PostResponse[] }>(`/medias/?limit=10&page=${pageNum}`, auth);
      const postsOnly: PostResponse[] = response.data;

      // Busca os dados de cada autor
      const authorPromises = postsOnly.map((post: PostResponse) =>
        ApiClient.get<Author>(`/users/${post.author._id}`, auth)
      );

      // Espera todas as requisicoes terminarem
      const authors: Author[] = await Promise.all(authorPromises);

      // Combina cada post com seu autor
      const combinedData: Media[] = postsOnly.map((post, index) => {
        return {
          ...post,
          author: authors[index],
          isLiked: post.isLiked || false,
        };
      });

      //setData(combinedData);
      // Atualiza o estado
    setData((prevData) => {
      if (pageNum === 1) { // Se a página esta sendo carregada pela primeira vez
        return combinedData;
      } else { // Se não só carrega mais posts
        return [...prevData, ...combinedData]; //...postsAntigos + ...postsNovos
      }
    });

    } catch (error) {
      console.error("Erro ao buscar dados do feed:", error);
    } finally {
      // Se for a primeira página, esconder loading
      if (pageNum === 1) {
        setLoading(false);
      }
    }
  };

  // Buscar o ID do usuário logado
  useEffect(() => {
    const fetchCurrentUser = async () => {
      if (auth.isLoaded) {
        try {
          const user = await ApiClient.get<CurrentUser>("/users/me", auth);
          setCurrentUserId(user._id);
        } catch (error) {
          console.error("Erro ao buscar usuário atual:", error);
        }
      }
    };
    fetchCurrentUser();
  }, [auth.isLoaded]);

  // Carrega a primeira página quando o componente monta
  useEffect(() => {
    if (auth.isLoaded) {
      fetchFeedData(1);
    }
  }, [auth.isLoaded]);

  const loadMore = async () => {
  if (loadingMore) {
    return;
  } 
  setLoadingMore(true);
  const nextPage = page + 1;
  await fetchFeedData(nextPage);
  setPage(nextPage);
  setLoadingMore(false);
  };

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
    setSelectedMedia(null);
    setIsModalVisible(false);
    setIsMenuVisible(false);
  };

  const handleMenu = () => {
    setIsMenuVisible((prev) => !prev);
  };

  const handleDeletePost = async (id: string) => {
    try {
      await ApiClient.delete(`/medias/${id}`, auth);
      // Remover o post da lista
      setData((prevData) => prevData.filter((post) => post._id !== id));
      setIsModalVisible(false);
      setIsMenuVisible(false);
    } catch (error) {
      console.error("Erro ao deletar post:", error);
    }
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
  }, [selectedMedia, isModalVisible]);

  if (loading && data.length === 0) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator
          size="large"
          color="#693274"
        />
      </View>
    );
  }

  return (
    <>
      <View style={styles.container}>
        <FlatList
          style={styles.feed}
          data={data}
          keyExtractor={item => item._id.toString()}
          onEndReached={loadMore} // scroll infinito
          onEndReachedThreshold={0.5} // scroll infinito
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
        onPressMenu={handleMenu}
        menuVisible={isMenuVisible}
        deletePost={handleDeletePost}
        currentUserId={currentUserId}
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
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#e9e5df",
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

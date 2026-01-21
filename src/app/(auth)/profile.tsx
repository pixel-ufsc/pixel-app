import CommentModal from "@/components/CommentModal";
import MediaModal from "@/components/MediaModal";
import api from "@/utils/api";
import { uploadImageToCloudinary } from "@/utils/cloudinary";
import { useAuth } from "@clerk/clerk-expo";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import { useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { Menu } from "react-native-paper";

interface User {
  _id: string;
  first_name: string;
  last_name: string;
  email: string;
  role: string;
  course: string;
  memberSince: string;
  profileImageUrl: string;
  bio: string;
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

interface MediaResponse {
  data: Media[];
}

export default function Profile() {
  const auth = useAuth();
  const { getToken, signOut } = useAuth();
  const { id } = useLocalSearchParams();

  
  const [loading, setLoading] = useState(true);
  const [cargo, setCargo] = useState("");
  const [editando, setEditando] = useState(false);
  const [menuVisible, setMenuVisible] = useState(false);
  const [isOwnProfile, setIsOwnProfile] = useState(!id);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [memberSince, setMemberSince] = useState("");
  const [fotoUrl, setFotoUrl] = useState("");
  const [bio, setBio] = useState("");
  const [posts, setPosts] = useState<Media[]>([]);
  const [userData, setUserData] = useState<User | null>(null);
  const [selectedMedia, setSelectedMedia] = useState<Media | null>(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedPostId, setSelectedPostId] = useState<string>("");
  const [showComments, setShowComments] = useState(false);
  const [isMenuVisible, setIsMenuVisible] = useState(false);
  const [currentUserId, setCurrentUserId] = useState<string | undefined>(undefined);
  const [isUploadingImage, setIsUploadingImage] = useState(false);

  const postsCount = posts.length;

  useEffect(() => {
    async function logTokenLongo() {
      try {
        const token = await getToken({ template: "supabase" });
      } catch (err) {
        console.error("Erro ao buscar token longo:", err);
      }
    }
    logTokenLongo();
  }, [getToken]);

  const handleDeletePost = async (id: string) => {
    try {
      await api.delete(`/medias/${id}`, { getToken });
      // Remover o post da lista
      setPosts((prevPosts) => prevPosts.filter((post) => post._id !== id));
      setIsModalVisible(false);
      setIsMenuVisible(false);
    } catch (error) {
      console.error("Erro ao deletar post:", error);
    }
  };
  const handleUserUpdate = async () => {
    try {
      setLoading(true);
      if (userData == null) throw TypeError;

      let profileImageUrlToSave = fotoUrl;

      // Verificar se a foto precisa ser enviada para Cloudinary
      // Se não é uma URL do Cloudinary e não é vazia, fazer upload
      const isCloudinaryUrl = fotoUrl && fotoUrl.includes("res.cloudinary.com");
      const isLocalUri = fotoUrl && (
        fotoUrl.startsWith("file://") || 
        fotoUrl.startsWith("content://") || 
        fotoUrl.startsWith("ph://") ||
        fotoUrl.startsWith("assets-library://")
      );

      if (fotoUrl && !isCloudinaryUrl && isLocalUri) {
        setIsUploadingImage(true);
        try {
          console.log("Fazendo upload da imagem para Cloudinary...");
          profileImageUrlToSave = await uploadImageToCloudinary(fotoUrl);
          console.log("Upload concluído:", profileImageUrlToSave);
          setFotoUrl(profileImageUrlToSave); // Atualizar o estado com a URL do Cloudinary
        } catch (error) {
          console.error("Erro ao fazer upload da imagem:", error);
          alert("Erro ao fazer upload da imagem. Tente novamente.");
          setIsUploadingImage(false);
          setLoading(false);
          return;
        } finally {
          setIsUploadingImage(false);
        }
      }

      // Garantir que não estamos enviando URI local
      if (profileImageUrlToSave && (
        profileImageUrlToSave.startsWith("file://") || 
        profileImageUrlToSave.startsWith("content://") || 
        profileImageUrlToSave.startsWith("ph://") ||
        profileImageUrlToSave.startsWith("assets-library://")
      )) {
        console.error("Tentativa de enviar URI local bloqueada:", profileImageUrlToSave);
        alert("Erro: A imagem não foi enviada corretamente. Tente novamente.");
        setLoading(false);
        return;
      }

      console.log("Enviando dados para o backend:", {
        first_name: firstName,
        last_name: lastName,
        profileImageUrl: profileImageUrlToSave?.substring(0, 50) + "...", // Log apenas início da URL
        bio: bio,
      });

      await api.put(
        `/users/${userData._id}`,
        { getToken },
        {
          first_name: firstName,
          last_name: lastName,
          profileImageUrl: profileImageUrlToSave,
          bio: bio,
        },
      );
    } catch (error) {
      console.error("Erro ao atualizar o usuário:", error);
    } finally {
      setLoading(false);
      setEditando(false);
    }
  };

  const handleSelectMedia = (media: Media) => {
    setSelectedMedia(media);
    setIsModalVisible(true);
  };

  const handleMenu = () => {
    setIsMenuVisible((editando) => !editando);
  };

  const handleCloseModal = () => {
    setSelectedMedia(null);
    setIsModalVisible(false);
  };

  const handleOpenComment = (postId: string) => {
    setSelectedPostId(postId);
    setShowComments(true);
  };

  const handleCloseComments = () => {
    setShowComments(false);
    setSelectedPostId("");
  };
  
  useEffect(() => {
    const fetchUser = async () => {
      const uri = id ? id : "me";
      try {
        const response = await api.get<User>(`/users/${uri}`, { getToken });
        setUserData(response);
      } catch (error) {
        console.error("Erro ao pedir dados do usuário:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  useEffect(() => {
    if (userData) {
      const fetchPosts = async () => {
        try {
          const userPosts = await api.get<MediaResponse>(
            `/medias/user/${userData._id}`,
            {
              getToken,
            },
          );
          // Adicionar informações do autor aos posts
          const postsWithAuthor = userPosts.data.map((post) => ({
            ...post,
            author: {
              _id: userData._id,
              first_name: userData.first_name,
              last_name: userData.last_name,
              role: userData.role,
              profileImageUrl: userData.profileImageUrl,
            },
          }));
          setPosts(postsWithAuthor);
        } catch (error) {
          console.error("Erro ao pedir mídias do usuário:", error);
        }
      };

      const checkOwnProfile = async () => {
        // Sempre buscar o usuário logado para comparar
        try {
          const ownUserResponse = await api.get<User>("/users/me", {
            getToken,
          });
          setCurrentUserId(ownUserResponse._id);
          // Checa se o perfil é o mesmo do usuário autenticado quando o perfil é acessado na página de membros
          if (id) {
            setIsOwnProfile(userData._id === ownUserResponse._id);
          } else {
            // Se não tem id, é o próprio perfil
            setIsOwnProfile(true);
          }
        } catch (error) {
          console.error("Erro ao buscar usuário atual:", error);
        }
      };

      checkOwnProfile();
      fetchPosts();
      setFirstName(userData.first_name);
      setLastName(userData.last_name);
      setCargo(userData.role);
      setMemberSince(userData.memberSince);
      setFotoUrl(userData.profileImageUrl);
      setBio(userData.bio);
    }
  }, [userData]);

  async function pickImage() {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      alert("É necessário permissão para acessar a galeria de fotos.");
      return;
    }
    let resultado = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });
    if (!resultado.canceled) {
      setFotoUrl(resultado.assets[0].uri);
    }
  }

  if (loading) {
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
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.profileHeader}>
        <View style={styles.profileImageWrapper}>
          <Image
            source={{ uri: fotoUrl }}
            style={styles.profileImage}
          />
          {isOwnProfile && editando && (
            <TouchableOpacity
              style={styles.changePhotoButton}
              onPress={pickImage}
              disabled={isUploadingImage}
            >
              <Text style={styles.changePhotoButtonText}>
                {isUploadingImage ? "Enviando..." : "Alterar foto"}
              </Text>
            </TouchableOpacity>
          )}
        </View>
        <View style={styles.profileInfo}>
          {editando ? (
            <>
              <TextInput
                style={styles.profileNameInput}
                value={firstName}
                onChangeText={setFirstName}
              />
              <TextInput
                style={styles.profileNameInput}
                value={lastName}
                onChangeText={setLastName}
              />
            </>
          ) : (
            <View>
              <Text
                style={styles.profileName}
              >{`${firstName} ${lastName}`}</Text>
            </View>
          )}
          <Text style={styles.profileMember}>
            {cargo} | Membro desde {memberSince}
          </Text>
          <Text style={styles.profilePosts}>{postsCount} posts</Text>
        </View>
        {isOwnProfile &&
          (editando ? (
            <TouchableOpacity
              style={styles.saveButton}
              onPress={handleUserUpdate}
            >
              <Text style={styles.saveButtonText}>Salvar</Text>
            </TouchableOpacity>
          ) : (
            <View style={styles.menuContainer}>
              <Menu
                visible={menuVisible}
                onDismiss={() => setMenuVisible(false)}
                anchor={
                  <TouchableOpacity
                    onPress={() => setMenuVisible(true)}
                    style={styles.menuButton}
                  >
                    <MaterialCommunityIcons
                      name="menu"
                      size={24}
                      color="#693274"
                    />
                  </TouchableOpacity>
                }
                contentStyle={styles.menuContent}
              >
                <Menu.Item
                  onPress={() => {
                    setEditando(true);
                    setMenuVisible(false);
                  }}
                  title="Editar"
                  leadingIcon="pencil"
                  titleStyle={styles.menuItemText}
                  style={styles.menuItem}
                />
                <Menu.Item
                  title="Sair"
                  leadingIcon="logout"
                  onPress={() => signOut()}
                  titleStyle={styles.menuItemText}
                  style={styles.menuItem}
                />
              </Menu>
            </View>
          ))}
      </View>

      {editando && isOwnProfile ? (
        <TextInput
          style={styles.profileBioInput}
          value={bio}
          onChangeText={setBio}
          multiline
        />
      ) : (
        <Text style={styles.profileBio}>{bio}</Text>
      )}

      <View style={styles.postsGrid}>
        <FlatList
          data={posts}
          numColumns={3}
          keyExtractor={item => item._id.toString()}
          renderItem={({ item }) => (
            <Pressable
              onPress={() => handleSelectMedia(item)}
              style={styles.postItem}
            >
              <Image
                source={{ uri: item.url }}
                style={styles.postItemImage}
                resizeMode="cover"
              />
            </Pressable>
          )}
        />
      </View>
      <MediaModal
        visible={isModalVisible}
        media={selectedMedia || null}
        onClose={handleCloseModal}
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
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fafafa",
    padding: 20,
  },
  profileHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
    position: "relative",
  },
  profileImageWrapper: {
    marginRight: 16,
    alignItems: "center",
  },
  profileImage: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: "#693274",
  },
  changePhotoButton: {
    marginTop: 8,
    backgroundColor: "#fff",
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#693274",
  },
  changePhotoButtonText: {
    color: "#693274",
    fontWeight: "bold",
    fontSize: 13,
  },
  profileInfo: {
    flex: 1,
    justifyContent: "center",
  },
  profileName: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#693274",
  },
  profileNameInput: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#693274",
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
    marginBottom: 2,
  },
  profileMember: {
    color: "#888",
    fontSize: 16,
  },
  profilePosts: {
    color: "#693274",

    fontSize: 16,
    marginTop: 2,
  },
  editButton: {
    position: "absolute",
    top: 0,
    right: 0,
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 8,
    backgroundColor: "#e0e0e0",
    zIndex: 2,
  },
  editButtonText: {
    color: "#023047",
    fontWeight: "bold",
    fontSize: 16,
  },
  profileBio: {
    marginTop: 8,
    marginBottom: 16,
    color: "#444",
    fontSize: 16,
  },
  profileBioInput: {
    marginTop: 8,
    marginBottom: 16,
    color: "#444",
    fontSize: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
    padding: 4,
  },
  postsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "flex-start",
    marginTop: 8,
  },
  postItem: {
    width: "33.33%",
  },
  postItemImage: {
    width: "100%",
    aspectRatio: 1,
    borderWidth: 0.2,
    borderColor: "#ccc",
  },
  menuContainer: {
    position: "absolute",
    top: 0,
    right: 0,
    zIndex: 1000,
  },
  menuButton: {
    width: 24,
    height: 24,
    justifyContent: "center",
    alignItems: "center",
  },
  saveButton: {
    position: "absolute",
    top: 0,
    right: 0,
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 8,
    backgroundColor: "#693274",
  },
  saveButtonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
  menuContent: {
    backgroundColor: "#fff",
    borderRadius: 8,
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  menuItem: {
    paddingVertical: 8,
  },
  menuItemText: {
    color: "#693274",
    fontSize: 16,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});

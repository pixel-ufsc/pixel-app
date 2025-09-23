import api from "@/utils/api";
import { useAuth } from "@clerk/clerk-expo";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import { useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Image,
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
}

interface MediaResponse {
  data: Media[];
}

export default function Profile() {
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
  const [posts, setPosts] = useState<string[]>([]);
  const [userData, setUserData] = useState<User | null>(null);

  const postsCount = posts.length;

  useEffect(() => {
    async function logTokenLongo() {
      try {
        const token = await getToken({ template: "supabase" });
        console.log("Token longo:", token);
      } catch (err) {
        console.error("Erro ao buscar token longo:", err);
      }
    }
    logTokenLongo();
  }, [getToken]);

  const handleUserUpdate = async () => {
    try {
      setLoading(true);
      if (userData == null) throw TypeError;
      await api.put(
        `/users/${userData._id}`,
        { getToken },
        {
          first_name: firstName,
          last_name: lastName,
          profileImageUrl: fotoUrl,
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

  useEffect(() => {
    const fetchUser = async () => {
      const uri = id ? id : "me";
      console.log(id);
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
          setPosts(userPosts.data.map((post: Media) => post.url));
        } catch (error) {
          console.error("Erro ao pedir mídias do usuário:", error);
        }
      };

      const checkOwnProfile = async () => {
        // Checa se o perfil é o mesmo do usuário autenticado quando o perfil é acessado na página de membros
        if (id) {
          const ownUserResponse = await api.get<User>("/users/me", {
            getToken,
          });
          setIsOwnProfile(userData._id === ownUserResponse._id);
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
    console.log(isOwnProfile);
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
            >
              <Text style={styles.changePhotoButtonText}>Alterar foto</Text>
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
        {posts.map((img, i) => (
          <Image
            key={i}
            source={{ uri: img }}
            style={styles.postItemImage}
            resizeMode="cover"
          />
        ))}
      </View>
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
  postItemImage: {
    width: "33.33%",
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

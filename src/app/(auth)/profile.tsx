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

export default function Profile() {
  const { signOut } = useAuth();
  const { id } = useLocalSearchParams();
  const isOwnProfile = !id;

  const [loading, setLoading] = useState(true);
  const [cargo, setCargo] = useState("");
  const [editando, setEditando] = useState(false);
  const [menuVisible, setMenuVisible] = useState(false);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [memberSince, setMemberSince] = useState("");
  const [fotoUrl, setFotoUrl] = useState("");
  const [bio, setBio] = useState("");

  const mockPosts = [
    "https://images.unsplash.com/photo-1506744038136-46273834b3fb",
    "https://images.unsplash.com/photo-1465101046530-73398c7f28ca",
    "https://images.unsplash.com/photo-1519125323398-675f0ddb6308",
    "https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e",
    "https://images.unsplash.com/photo-1519985176271-adb1088fa94c",
    "https://images.unsplash.com/photo-1438761681033-6461ffad8d80",
  ];

  const postsCount = mockPosts.length;

  useEffect(() => {
    const mockUser: User = {
      _id: "123",
      first_name: "Gabriel",
      last_name: "Pereira",
      email: "gabriel@exemplo.com",
      role: "Desenvolvedor",
      course: "Sistemas de Informação",
      memberSince: "2023/1",
      profileImageUrl: "https://images.unsplash.com/photo-1634130287199-7889bc37f7fe",
      bio: "Alguma bio sobre mim.",
    };

    setFirstName(mockUser.first_name);
    setLastName(mockUser.last_name);
    setCargo(mockUser.role);
    setMemberSince(mockUser.memberSince);
    setFotoUrl(mockUser.profileImageUrl);
    setBio(mockUser.bio);
    setLoading(false);
  }, []);

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
              <Text style={styles.profileName}>{`${firstName} ${lastName}`}</Text>
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
              onPress={() => setEditando(false)}
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
        {mockPosts.map((img, i) => (
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

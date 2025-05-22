import { View, Text, StyleSheet, Image, TouchableOpacity, TextInput } from 'react-native';
import { Button } from 'react-native-paper';
import { useAuth } from '@clerk/clerk-expo';
import { useState } from 'react';
import * as ImagePicker from 'expo-image-picker'; 

export default function Profile({ isOwnProfile = true }) {
  const { signOut } = useAuth();

  const [editando, setEditando] = useState(false);
  const [nome, setNome] = useState('Joana da Silva');
  const [email, setEmail] = useState('gabriel@pixel.com');
  const [memberSince, setMemberSince] = useState('2024/2');
  const [fotoUrl, setFotoUrl] = useState('https://images.unsplash.com/photo-1634130287199-7889bc37f7fe?q=80&w=1964&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D');
  const [bio, setBio] = useState('Alguma bio sobre mim');

  // Array de imagens mock para os posts
  const mockPosts = [
    'https://images.unsplash.com/photo-1506744038136-46273834b3fb',
    'https://images.unsplash.com/photo-1465101046530-73398c7f28ca',
    'https://images.unsplash.com/photo-1519125323398-675f0ddb6308',
    'https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e',
    'https://images.unsplash.com/photo-1519985176271-adb1088fa94c',
    'https://images.unsplash.com/photo-1438761681033-6461ffad8d80',
  ];

  const postsCount = mockPosts.length;

  async function pickImage() {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      alert('É necessário permissão para acessar a galeria de fotos.');
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

  return (
    <View style={styles.container}>
      <View style={styles.profileHeader}>
        <View style={styles.profileImageWrapper}>
          <Image source={{ uri: fotoUrl }} style={styles.profileImage} />
          {isOwnProfile && editando && (
            <TouchableOpacity style={styles.changePhotoButton} onPress={pickImage}>
              <Text style={styles.changePhotoButtonText}>Alterar foto</Text>
            </TouchableOpacity>
          )}
        </View>
        <View style={styles.profileInfo}>
          {editando ? (
            <TextInput
              style={styles.profileNameInput}
              value={nome}
              onChangeText={setNome}
            />
          ) : (
            <Text style={styles.profileName}>{nome}</Text>
          )}
          <Text style={styles.profileMember}>Membro desde {memberSince}</Text>
          <Text style={styles.profilePosts}>{postsCount} posts</Text>
        </View>
        {isOwnProfile && (
          <TouchableOpacity style={styles.editButton} onPress={() => setEditando(!editando)}>
            <Text style={styles.editButtonText}>{editando ? 'Salvar' : 'Editar'}</Text>
          </TouchableOpacity>
        )}
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
          <Image key={i} source={{ uri: img }} style={styles.postItemImage} />
        ))}
      </View>
      {isOwnProfile && (
        <Button
          icon="logout"
          mode="contained"
          onPress={() => signOut()}
          style={{ marginTop: 32, backgroundColor: '#693274' }}
        >
          Sair
        </Button>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fafafa',
    padding: 16,
  },
  profileHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    position: 'relative',
  },
  profileImageWrapper: {
    marginRight: 16,
    alignItems: 'center',
  },
  profileImage: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: '#693274',
  },
  changePhotoButton: {
    marginTop: 8,
    backgroundColor: '#fff',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#693274',
  },
  changePhotoButtonText: {
    color: '#693274',
    fontWeight: 'bold',
    fontSize: 13,
  },
  profileInfo: {
    flex: 1,
    justifyContent: 'center',
  },
  profileName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#693274',
  },
  profileNameInput: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#693274',
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    marginBottom: 2,
  },
  profileMember: {
    color: '#888',
    fontSize: 16,
  },
  profilePosts: {
    color: '#693274',
    
    fontSize: 16,
    marginTop: 2,
  },
  editButton: {
    position: 'absolute',
    top: 0,
    right: 0,
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 8,
    backgroundColor: '#e0e0e0',
    zIndex: 2,
  },
  editButtonText: {
    color: '#023047',
    fontWeight: 'bold',
    fontSize: 16,
  },
  profileBio: {
    marginTop: 8,
    marginBottom: 16,
    color: '#444',
    fontSize: 16,
  },
  profileBioInput: {
    marginTop: 8,
    marginBottom: 16,
    color: '#444',
    fontSize: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    padding: 4,
  },
  postsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'flex-start',
    marginTop: 8,
  },
  postItem: {
    width: '33.33%',
    aspectRatio: 1,
    backgroundColor: '#dadada',
    borderWidth: 0.2,
    borderColor: '#888',
  },
  postItemImage: {
    width: '33.33%',
    aspectRatio: 1,
    borderWidth: 0.2,
    borderColor: '#ccc',
  },
});

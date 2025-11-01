import ApiClient from "@/utils/api";
import { useAuth } from "@clerk/clerk-expo";
import * as ImagePicker from "expo-image-picker";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
  Image,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";

export default function NewPostScreen() {
  const [localImageUri, setLocalImageUri] = useState<string | null>(null);
  const [caption, setCaption] = useState("");
  const [isPublishing, setIsPublishing] = useState(false);
  const router = useRouter();
  const auth = useAuth();

  useEffect(() => {
    (async () => {
      const { status } =
        await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== "granted") {
        console.log("Permissão negada", "Permita acesso à galeria.");
        router.back();
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        quality: 0.8,
      });

      if (result.canceled || !result.assets?.length) {
        router.back();
        return;
      }

      const uri = result.assets[0].uri;
      setLocalImageUri(uri);
    })();
  }, []);

  const handlePublish = async () => {
    if (!localImageUri) return;

    const formData = new FormData();

    if (Platform.OS === "web") {
      formData.append("file", localImageUri);
    } else {
      formData.append("file", {
        uri: localImageUri,
        name: "upload.jpg",
        type: "image/jpeg",
      } as any);
    }

    formData.append("upload_preset", process.env.EXPO_PUBLIC_CLOUDINARY_UPLOAD_PRESET!);
    const cloudName = process.env.EXPO_PUBLIC_CLOUDINARY_CLOUD_NAME!;

    try {
      setIsPublishing(true);

      const response = await fetch(
        `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
        {
          method: "POST",
          body: formData,
        },
      );

      if (response.ok) {
        const data = await response.json();

        await ApiClient.post(
          "/medias",
          auth,
          {
            title: "Teste",
            description: caption,
            url: data.secure_url,
          },

        );

        if (data.secure_url) {
          router.back();
        } else {
          console.log(
            "Erro ao enviar imagem",
            data.error?.message || "Erro desconhecido",
          );
        }
      }

      setIsPublishing(false);
    } catch (err: any) {
      setIsPublishing(false);
      console.log("Erro inesperado", err.message);
    }
  };

  if (!localImageUri) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <Text>Aguardando imagem...</Text>
      </View>
    );
  }

  return (
    <View style={{ flex: 1 }}>
      <LinearGradient
        colors={["rgba(0, 0, 0, 0.8)", "transparent"]}
        style={styles.gradient}
        pointerEvents="none"
      />
      <View style={styles.headerContainer}>
        {/* Botão de voltar */}
        <Pressable style={styles.backButton}>
          <Image source={require("../../../assets/images/arrow-back.png")} />
        </Pressable>

        {/* Botões da direita */}
        <View style={styles.rightButtons}>
          <Pressable style={styles.actionButton}>
            <Text style={styles.buttonText}>Selecionar</Text>
          </Pressable>
          <Pressable
            style={styles.publishButton}
            onPress={handlePublish}
            disabled={isPublishing}
          >
            <Text style={styles.buttonText}>
              {isPublishing ? "..." : "Publicar"}
            </Text>
          </Pressable>
        </View>
      </View>
      <Image
        source={{ uri: localImageUri }}
        style={{
          width: "100%",
          height: 400,
          marginBottom: 20,
        }}
        resizeMode="cover"
      />

      <TextInput
        placeholder="Escreva uma legenda..."
        value={caption}
        onChangeText={setCaption}
        multiline
        style={{
          borderWidth: 1,
          borderColor: "#ccc",
          borderRadius: 8,
          padding: 12,
          height: 100,
          textAlignVertical: "top",
          marginBottom: 16,
        }}
      />
    </View>
  );
}

export const styles = StyleSheet.create({
  gradient: {
    position: "absolute",
    top: 0,
    height: 60,
    width: "100%",
    zIndex: 10000,
  },
  headerContainer: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    zIndex: 9999,
  },
  backButton: {
    backgroundColor: "black",
    borderRadius: 100,
    padding: 4,
  },
  rightButtons: {
    flexDirection: "row",
    gap: 12,
  },
  actionButton: {
    borderWidth: 1,
    borderColor: "#fff",
    borderRadius: 20,
    backgroundColor: "#818181",
    padding: 10,
  },
  publishButton: {
    backgroundColor: "#2196f3",
    borderWidth: 1,
    borderColor: "#fff",
    borderRadius: 20,
    alignItems: "center",
    padding: 10,
    width: 76,
  },
  buttonText: {
    color: "#fff", // ou qualquer outra cor
    fontWeight: "bold",
  },
});

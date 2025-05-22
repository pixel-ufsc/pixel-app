import { LinearGradient } from "expo-linear-gradient";
import { Image, Pressable, Text, View } from "react-native";
import { Modal, Portal } from "react-native-paper";
import { styles } from "./style";

interface Media {
  _id: string;
  description: string;
  url: string;
  createdAt: Date;
}

interface MediaModalProps {
  visible: boolean;
  media: Media | null;
  onClose: () => void;
}

export default function MediaModal({
  visible,
  media,
  onClose,
}: MediaModalProps) {
  if (!media) return null;

  return (
    <Portal>
      <Modal
        visible={visible}
        contentContainerStyle={{
          backgroundColor: "#000",
          height: "100%",
          width: "100%",
        }}
      >
        <View style={{ flex: 1, backgroundColor: "#000" }}>
          <Pressable
            onPress={onClose}
            style={{ position: "absolute", padding: 10, zIndex: 9999 }}
          >
            <Image source={require("../../../assets/images/arrow-back.png")} />
          </Pressable>

          <Image
            style={styles.modalMedia}
            source={{ uri: media.url }}
            resizeMode="contain"
          />

          <LinearGradient
            colors={["transparent", "rgba(0, 0, 0, 0.8)"]}
            style={styles.gradient}
          />

          <View
            style={{
              position: "absolute",
              bottom: 0,
              padding: 16,
              paddingRight: 64,
              zIndex: 2,
            }}
          >
            <View
              style={{
                flexDirection: "row",
                gap: 10,
                alignItems: "center",
              }}
            >
              <View style={styles.userImage}></View>
              <View>
                <Text style={styles.userName}>Eduardo Delduqui</Text>
                <Text style={styles.userRole}>Software Engineer</Text>
              </View>
            </View>
            <Text style={styles.mediaDescription}>{media.description}</Text>
          </View>

          <View style={styles.footerActions}>
            <Pressable
              onPress={() => console.log("Like!")}
              style={styles.footerActionContainer}
            >
              <Image
                style={styles.footerIcon}
                source={require("../../../assets/images/thumb_up-white.png")}
              />
              <Text style={styles.footerActionText}>149</Text>
            </Pressable>
            <Pressable
              onPress={() => console.log("Comentário")}
              style={styles.footerActionContainer}
            >
              <Image
                style={styles.footerIcon}
                source={require("../../../assets/images/comment-white.png")}
              />
              <Text style={styles.footerActionText}>100</Text>
            </Pressable>
            <Pressable
              onPress={() => console.log("Compartilhamento")}
              style={styles.footerActionContainer}
            >
              <Image
                style={styles.footerIcon}
                source={require("../../../assets/images/send-white.png")}
              />
            </Pressable>
          </View>
        </View>
      </Modal>
    </Portal>
  );
}

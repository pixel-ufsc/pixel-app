import { LinearGradient } from "expo-linear-gradient";
import { Image, Pressable, Text, View } from "react-native";
import { Modal, Portal } from "react-native-paper";
import { styles } from "./style";

interface Media {
  _id: string;
  description: string;
  url: string;
  createdAt: Date;
  totalLikes:number;
  totalComments: number;
  author : {
    first_name: string,
    last_name: string,     
    role: string,
    profileImageUrl: string,
  };
}

interface MediaModalProps {
  visible: boolean;
  media: Media | null;
  onClose: () => void;
  onComment?: () => void;
}

export default function MediaModal({
  visible,
  media,
  onClose,
  onComment,
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
                <Text style={styles.userName}>{media.author.first_name} {media.author.last_name}</Text>
                <Text style={styles.userRole}>{media.author.role}</Text>
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
              <Text style={styles.footerActionText}>{media.totalLikes}</Text>
            </Pressable>
            <Pressable
              onPress={onComment}
              style={styles.footerActionContainer}
            >
              <Image
                style={styles.footerIcon}
                source={require("../../../assets/images/comment-white.png")}
              />
              <Text style={styles.footerActionText}>{media.totalComments}</Text>
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

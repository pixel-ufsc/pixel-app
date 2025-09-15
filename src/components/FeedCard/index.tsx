import formatDate from "@/utils/date";
import React from "react";
import { Image, Pressable, Text, View } from "react-native";
import { styles } from "./style";

interface FeedCardProps {
  description: string;
  url: string;
  createdAt: Date;
  author : {
      first_name: string,
      last_name: string,     
      role: string,
      profileImageUrl: string,
    };
  totalLikes:number;
  totalComments: number;
  onComment?: () => void;
}

const FeedCard: React.FC<FeedCardProps> = ({ description, url, createdAt, totalLikes, totalComments, author, onComment }) => {
  const mediaDate = new Date(createdAt);
  const currentDate = new Date();
  let date;

  /** @TODO futuramente não precisaremos desse valor default de 3d */
  if (createdAt) {
    date = formatDate(mediaDate, currentDate);
  } else {
    date = "3d";
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.topDescription}>
          <View style={styles.userThumbnail}>
            <Image
              style={styles.userImage}
              source={{ uri: author.profileImageUrl }}
            />
          </View>
          <View style={styles.headerDescription}>
            <Text style={styles.userName}>{author.first_name} {author.last_name}</Text>
            <Text style={styles.userRole}>{author.role}</Text>
            <Text style={styles.date}>{date}</Text>
          </View>
        </View>
        <Text numberOfLines={2}>{description}</Text>
      </View>
      <Image
        style={styles.image}
        source={{ uri: url }}
      />
      <View style={styles.footer}>
        <View style={styles.cardStats}>
          <View>
            <Text style={styles.statsText}>{totalLikes}</Text>
          </View>
          <Text style={styles.statsText}>{totalComments}</Text>
        </View>
        <View style={styles.footerActions}>
          <Pressable
            onPress={() => console.log("Like!")}
            style={styles.footerActionContainer}
          >
            <Image
              style={styles.footerIcon}
              source={require("../../../assets/images/thumb_up-icon.png")}
            />
            <View>
              <Text style={styles.footerActionText}>Gostei</Text>
            </View>
          </Pressable>
          <Pressable
            onPress={onComment}
            style={styles.footerActionContainer}
          >
            <Image
              style={styles.footerIcon}
              source={require("../../../assets/images/comment-icon.png")}
            />
            <View>
              <Text style={styles.footerActionText}>Comentar</Text>
            </View>
          </Pressable>
          <Pressable
            onPress={() => console.log("Compartilhamento")}
            style={styles.footerActionContainer}
          >
            <Image
              style={styles.footerIcon}
              source={require("../../../assets/images/send-icon.png")}
            />
            <View>
              <Text style={styles.footerActionText}>Enviar</Text>
            </View>
          </Pressable>
        </View>
      </View>
    </View>
  );
};

export default FeedCard;

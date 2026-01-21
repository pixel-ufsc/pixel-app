import formatDate from "@/utils/date";
import React from "react";
import { Image, Pressable, Text, View } from "react-native";
import { styles } from "./style";

interface FeedCardProps {
  id: string;
  isLiked: boolean;
  description: string;
  url: string;
  createdAt: Date;
  author: {
    first_name: string;
    last_name: string;
    role: string;
    profileImageUrl: string;
  };
  totalLikes: number;
  totalComments: number;
  onComment?: () => void;
  onLike: () => void;
}

const FeedCard: React.FC<FeedCardProps> = ({
  id,
  isLiked,
  description,
  url,
  createdAt,
  totalLikes,
  totalComments,
  author,
  onLike,
  onComment,
}) => {
  const mediaDate = new Date(createdAt);
  const currentDate = new Date();
  let date;

  /** @TODO futuramente não precisaremos desse valor default de 3d */
  if (createdAt) {
    try {
      date = formatDate(mediaDate, currentDate);
    } catch (err) {
      date = "3d";
    }
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
              source={
                author.profileImageUrl
                  ? { uri: author.profileImageUrl }
                  : require("../../../assets/images/register-user-logo.png")
              }
            />
          </View>
          <View style={styles.headerDescription}>
            <Text style={styles.userName}>
              {author.first_name} {author.last_name}
            </Text>
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
            onPress={onLike}
            style={styles.footerActionContainer}
          >
            <Image
              style={styles.footerIcon}
              source={
                isLiked
                  ? require("../../../assets/images/thumb_up_full-icon.png")
                  : require("../../../assets/images/thumb_up-icon.png")
              }
            />
            <View>
              <Text
                style={[
                  styles.footerActionText,
                  { color: isLiked ? "#490471ff" : "#000000b3" },
                ]}
              >
                Gostei
              </Text>
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
        </View>
      </View>
    </View>
  );
};

export default FeedCard;

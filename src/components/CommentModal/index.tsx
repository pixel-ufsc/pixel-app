import api from '@/utils/api';
import { useAuth } from '@clerk/clerk-expo';
import { Ionicons } from '@expo/vector-icons';
import React, { useEffect, useState } from 'react';
import { FlatList, Modal, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { styles } from './style';

interface Comment {
  _id: string;
  mediaId: string;
  content: string;
  author: {
    first_name: string;
    last_name: string;
    _id: string;
    _links: {
      self: {
        method: string;
        href: string;
      };
    };
  };
  _links: {
    self: { method: string; href: string };
    removeComment: { method: string; href: string };
    media: { method: string; href: string };
    user: { method: string; href: string };
  };
}

interface CommentModalProps {
  visible: boolean;
  onClose: () => void;
  postId: string;
  auth: ReturnType<typeof useAuth>;
}

const CommentModal: React.FC<CommentModalProps> = ({ visible, onClose, postId, auth }) => {
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (visible) {
      fetchComments();
    }
  }, [visible]);

  const fetchComments = async () => {
    setLoading(true);
    try {
      const response = await api.get<{ data: Comment[] }>(`/medias/${postId}/comments`, auth);
      setComments(response.data || []);
    } catch (error) {
      console.error('Erro ao buscar comentários:', error);
      setComments([]);
    } finally {
      setLoading(false);
    }
  };

  const handleAddComment = async () => {
    if (!newComment.trim()) return;  
    try {
      await api.post(`/medias/${postId}/comment`, auth, { content: newComment });
      setNewComment('');
      fetchComments();
    } catch (error) {
      console.error('Erro ao adicionar comentário:', error);
    }
  };
  return (
    <Modal visible={visible} animationType="slide" onRequestClose={onClose} transparent>
      <View style={styles.overlay}>
        <View style={styles.container}>
          <TouchableOpacity onPress={onClose} style={styles.closeButton}>
            <Ionicons name="close" size={24} color="#693274" />
          </TouchableOpacity>
          {loading ? (
            <View style={{ alignItems: 'center', marginVertical: 16 }}>
              <Text>Carregando comentários...</Text>
            </View>
          ) : (
            <FlatList
              data={comments}
              keyExtractor={(item) => item._id}
              renderItem={({ item }) => (
                <View style={styles.comment}>
                  <Text style={styles.author}>{item.author["first_name"]} {item.author["last_name"]}</Text>
                  <Text>{item.content}</Text>
                </View>
              )}
              style={styles.list}
              ListEmptyComponent={() => (
                <View style={styles.comment}>
                  <Text>Nenhum comentário ainda. Seja o primeiro!</Text>
                </View>
              )}
            />
          )}
          <View style={styles.inputContainer}>
            <TextInput
              value={newComment}
              onChangeText={setNewComment}
              placeholder="Digite seu comentário..."
              style={styles.input}
            />
            <TouchableOpacity  onPress={handleAddComment}>
                <Text style={styles.button}>Enviar</Text>    
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default CommentModal;
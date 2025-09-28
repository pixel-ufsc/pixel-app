import { useAuth } from "@clerk/clerk-expo";
import { useCallback, useEffect, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  RefreshControl,
  StyleSheet,
  Text,
  View,
} from "react-native";
import CardMembro from "../../components/MemberCard/index";
import api from "../../utils/api";

interface Member {
  _id: string;
  first_name: string;
  last_name: string;
  email: string;
  role: string;
  memberSince: string;
  image: string;
}

interface ApiResponse {
  data: Member[];
}

export default function Members() {
  const [members, setMembers] = useState<Member[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { getToken } = useAuth();

  const fetchMembers = async () => {
    try {
      const responseData = await api.get<ApiResponse>("/users", { getToken });

      if (
        !responseData ||
        !responseData.data ||
        !Array.isArray(responseData.data)
      ) {
        setError("Formato de dados inválido");
        return;
      }

      const formattedMembers = responseData.data.map(user => ({
        _id: user._id,
        first_name: user.first_name,
        last_name: user.last_name,
        email: user.email,
        role: user.role || "Membro",
        memberSince: user.memberSince || "2024/2",
        image:
          user.image ||
          "https://images.unsplash.com/photo-1511367461989-f85a21fda167",
      }));

      setMembers(formattedMembers);
      setError(null);
    } catch (error) {
      setError(
        error instanceof Error ? error.message : "Erro ao carregar membros",
      );
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    fetchMembers();
  }, []);

  useEffect(() => {
    fetchMembers();
  }, []);

  const Header = () => (
    <View style={styles.header}>
      <Text style={styles.titulo}>Nossos Membros</Text>
      <Text style={styles.subtitulo}>
        Saiba quais são os membros que fazem parte da Pixel atualmente
      </Text>
    </View>
  );

  if (loading && !refreshing && members.length === 0) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator
          size="large"
          color="#693274"
        />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>{error}</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={members}
        keyExtractor={item => item._id}
        renderItem={({ item }) => (
          <CardMembro
            id={item._id}
            nome={`${item.first_name} ${item.last_name}`}
            imagem={item.image}
            membroDesde={item.memberSince}
            role={item.role}
          />
        )}
        ListHeaderComponent={Header}
        contentContainerStyle={{ alignItems: "center", paddingBottom: 16 }}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={["#693274"]}
          />
        }
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>Nenhum membro encontrado</Text>
          </View>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    padding: 20,
  },
  header: {
    alignItems: "flex-start",
    width: "100%",
  },
  titulo: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#693274",
  },
  subtitulo: {
    fontSize: 16,
    color: "#555",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  errorText: {
    color: "red",
    textAlign: "center",
    fontSize: 16,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  emptyText: {
    color: "#666",
    textAlign: "center",
    fontSize: 16,
  },
});

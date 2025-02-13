import AsyncStorage from "@react-native-async-storage/async-storage";
import { useEffect, useState } from "react";
import { View, Text } from "react-native";

export default function Profile() {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const getSessionToken = async () => {
      try {
        const token = await AsyncStorage.getItem("sessionToken");
        if (!token) {
          console.error("Nenhum token encontrado!");
          return;
        }
        const API_URL = `<SEU_IP>:3040/users`;

        const response = await fetch(API_URL, {
          method: "GET",
          headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json"
          }
        });

        if (!response.ok) {
          throw new Error(`Erro na requisição: ${response.status}`);
        }

        const data = await response.json();
        console.log(data);
        setUsers(data);
      } catch (error) {
        console.error("Erro ao buscar usuários:", error);
      }
    };

    getSessionToken();
  }, []);

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>Tela de Membros</Text>
    </View>
  );
}

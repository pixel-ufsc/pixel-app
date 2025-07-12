import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
    card: {      
      alignSelf: 'center',
      backgroundColor: '#fff',
      borderRadius: 10,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 3,
      elevation: 3,
      paddingHorizontal: 20,
      paddingVertical: 30,
      flexDirection: 'row',
      alignItems: 'center',
      marginVertical: 10,
    },
    image: {
      width: 100,
      height: 100,
      borderRadius: 50,
    },
    infoContainer: {
      flex: 1,
      marginLeft: 15,
    },
    name: {
      fontSize: 20,
      fontWeight: 'bold',
      color: '#023047',
    },
    membersince: {
      fontSize: 16,
      color: '#555',
    },
    text: {
      fontSize: 16,
      color: '#023047',
    },
  });
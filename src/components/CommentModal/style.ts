import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({

    overlay: { 
        flex: 1, 
        backgroundColor: 'rgba(0,0,0,0.5)', 
        justifyContent: 'center' 
    },
    container: {
        backgroundColor: '#fff',
        borderRadius: 8,
        padding: 16,
        height: '90%',
        maxHeight: '90%',
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        alignSelf: 'center',
      },
    closeButton: {
        alignSelf: 'flex-end' 
    },
    closeText: { 
        color: 'blue', 
        fontWeight: 'bold' 
    },
    list: { 
        marginVertical: 8 
    },
    comment: { 
        marginBottom: 8 
    },
    author: { 
        fontWeight: 'bold' 
    },
    inputContainer: { 
        flexDirection: 'row',
        alignItems: 'center' 
    },
    input: { 
        flex: 1,
        borderWidth: 1,
        color: '#666',
        borderColor: '#ccc',
        borderRadius: 8,
        marginRight: 8,
        padding: 8 
    },
    button: {
        borderRadius:8,
        backgroundColor:'#693274',
        color:'white',
        fontWeight:'500',
        paddingVertical: 9,
        paddingHorizontal: 16,

    }
});
import {
  Image,
  ImageBackground,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { TextInput } from "react-native-paper";
import React, { useState } from "react";
import { useAuth } from "@clerk/clerk-react";
import AntDesign from '@expo/vector-icons/AntDesign';
import { NativeSyntheticEvent, TextInputChangeEventData } from "react-native";
import { Picker } from "@react-native-picker/picker";

function RegisterPage(){
    const [nameVerify,setNameVerify] = useState(false);
    const [firstName, setFirstName] = useState("");
    const [lastNameVerify,setLastNameVerify] = useState(false);
    const [lastName, setLastName] = useState("");
    const [memberSince, setMemberSince] = useState("");
    const [fotoUrl, setFotoUrl] = useState("");
    const [bio, setBio] = useState(""); 
    const [email, setEmail] = useState(""); 
    const [emailVerify, setEmailVerify] = useState(false); 
    const [role, setRole] = useState(""); 
    const { getToken, isLoaded, userId } = useAuth();
    const [selectedOption, setSelectedOption] = useState<string>(""); //picker

    function handleName(e : NativeSyntheticEvent<TextInputChangeEventData>){
      const nameVar = e.nativeEvent.text
      setFirstName(nameVar)
       const isValid = !/[^a-zA-ZÀ-ÿ\s]/.test(nameVar);
      console.log(nameVar, isValid , nameVerify);
      if(nameVar.trim().length > 1 && isValid) { // testa se tem uma e se é somente letra{
        setNameVerify(true); //cuidado aqui
      }
      else {
        setNameVerify(false);
      }
    }

    function handleLastName(e :  NativeSyntheticEvent<TextInputChangeEventData>){
      const LastNameVar = e.nativeEvent.text
      setLastName(LastNameVar)
      const isValid = !/[^a-zA-ZÀ-ÿ\s]/.test(LastNameVar);
      console.log(LastNameVar, isValid);
      if(LastNameVar.trim().length > 1 && isValid) { // testa se tem uma e se é somente letra{
        setLastNameVerify(true); //cuidado aqui
      }
      else {
        setLastNameVerify(false);
      }
    }

    function handleEmail(e :  NativeSyntheticEvent<TextInputChangeEventData>){
      const EmailVar = e.nativeEvent.text
      setEmail(EmailVar)
      const isValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(EmailVar);
      console.log(EmailVar, isValid);
      if(EmailVar.trim().length > 1 && isValid) { // testa se tem uma e se é somente letra{
        setEmailVerify(true); //cuidado aqui
      }
      else {
        setEmailVerify(false);
      }
    }

   async function handleSubmit() {

    if (!isLoaded || !userId) {
      console.warn("Usuário não logado ou auth ainda carregando.");
      return;
    }
    
  try {
     const token = await getToken();

    const userData = {
      first_name : firstName,
      last_name : lastName, 
      email : email, 
      bio : bio, 
      profileImageUrl : fotoUrl, 
      role : role, 
      memberSince : memberSince,
    }
    const response = await fetch("http://192.168.1.13:3040/users", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`,
      },
      body: JSON.stringify(userData),
     
    });

    if (!response.ok) {
         const errorText = await response.text();
        console.error("Erro ao registrar usuário:", errorText);
        return;
    }

    const result = await response.json();
    console.log("Usuário cadastrado:", result);
  } catch (error) {
    console.error(error);
  }
}
  return(
    <View  style={styles.userContainer} >
      <ImageBackground source = {require("../../../assets/images/register-bg.png")} resizeMode="repeat" style = {styles.Img}></ImageBackground>
      <Image source = {require("../../../assets/images/register-user-logo.png")} style = {styles.userIcon}></Image>
      <View style = {styles.registerInputHolder}>
        <Text style = {styles.userWelcome}>Bem vindo(a) ao PixelApp</Text>
        <View style = {styles.TextInputHolder}>
        <TextInput 
          underlineColor="transparent"
          activeUnderlineColor="transparent"
          placeholder="Nome" 
          style={styles.registerInput} 
          value={firstName}
          onChangeText={setFirstName}
          onChange={(e => handleName(e))}
          />
          {firstName.trim().length <= 1 ? null : nameVerify ? (<AntDesign style = {styles.Icon} name="check" size={20} color="black" />) : (<AntDesign style = {styles.Icon} name="close" size={20} color="black"/>)}
          </View>

          <View style = {styles.TextInputHolder}>
            <TextInput 
              underlineColor="transparent"
              activeUnderlineColor="transparent"
              placeholder="Sobrenome" 
              style={styles.registerInput} 
              value={lastName}
              onChangeText={setLastName}
              onChange={(e => handleLastName(e))}
            />
           {lastName.trim().length < 1 ? null : lastNameVerify ? (<AntDesign style = {styles.Icon} name="check" size={20} color="black" />) : (<AntDesign style = {styles.Icon} name="close" size={20} color="black"/>)}
          </View> 
          <TextInput 
            underlineColor="transparent"
            activeUnderlineColor="transparent" 
            placeholder="Data de início" 
            style={styles.registerInput} 
            value={memberSince}
            onChangeText={setMemberSince}
          />
      <View>
        <Picker
          selectedValue={selectedOption}
          style={styles.CargoDropdown}
          onValueChange={(itemValue) => setSelectedOption(itemValue)}
        >
          <Picker.Item label="Cargo na Pixel" value="" />
          <Picker.Item label="Trainee" value="op1" />
          <Picker.Item label="Efetivo" value="op2" />
          <Picker.Item label="Diretor de Projetos" value="op4" />
          <Picker.Item label="Diretor de Marketing" value="op5" />
          <Picker.Item label="Diretor de DH" value="op6" />
          <Picker.Item label="Diretor de Comercial" value="op7" />
          <Picker.Item label="Presidente" value="op8" />
        </Picker>
      </View>
          <View style = {styles.TextInputHolder}>
          <TextInput 
            underlineColor="transparent"
            activeUnderlineColor="transparent" 
            placeholder="Email" 
            style={styles.registerInput} 
            value={email}
            onChangeText={setEmail}
            onChange={(e => handleEmail(e))}
          />
          {email.trim().length < 1 ? null : emailVerify ? (<AntDesign style = {styles.Icon} name="check" size={20} color="black" />) : (<AntDesign style = {styles.Icon} name="close" size={20} color="black"/>)}
          </View>
            <TextInput 
            underlineColor="transparent"
             activeUnderlineColor="transparent"
              placeholder="Biografia (opcional)" 
              style={styles.registerInput} 
              value={bio}
              onChangeText={setBio}
            />

      <TouchableOpacity 
      style={styles.Button}
      onPress={handleSubmit}>
          <Text style={styles.ButtonText}>Registrar</Text>
        </TouchableOpacity>
        </View>
      
    </View>
  )
}

export default RegisterPage;

const styles = StyleSheet.create({
  userIcon: {
    width: 100,
    height: 100,
    borderRadius: 35,
    position: "absolute",
    alignSelf:"center",
    top:60,
    zIndex:10,
  },
  userContainer: {
    flex:1,
  },
  LabelRegister:{
    boxSizing: "border-box",
    alignItems: "center",
    justifyContent: "flex-end",
  },
  Img:{
      width: "100%",
      flex:1,
  },
  userWelcome: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#693274",
    marginBottom:25,
  },
  CargoDropdown:{
    width:300,
    height:45,
    marginBottom:19,
    backgroundColor: "#D9D9D9",
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
    borderBottomLeftRadius: 25,
    borderBottomRightRadius: 25,
    
  },
  registerInput:{
    width:300,
    backgroundColor: "#D9D9D9",
    marginBottom:19,
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
    borderBottomLeftRadius: 25,
    borderBottomRightRadius: 25,
  },
  registerInputHolder:{
    alignItems: "center",
    justifyContent:"center",
    backgroundColor: "white",
    flex:5,
  },
  Icon : {
    position: 'absolute',
    right: 10,
    top:21,
  },
  TextInputHolder:{
    flexDirection: "row",
  },

  ButtonText:{
    fontSize: 18,
    fontWeight: "bold",
    color: "#ffffffff",
  },

  Button:{
    backgroundColor:"purple",
    width:300,
    height:55,
    borderRadius:10,
    alignItems: "center",
    justifyContent: "center",
  },
});

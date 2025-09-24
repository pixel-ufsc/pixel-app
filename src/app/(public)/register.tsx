import {
  Image,
  ImageBackground,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  NativeSyntheticEvent, TextInputChangeEventData,
  Dimensions,
  ScrollView,
} from "react-native";
import { TextInput } from "react-native-paper";
import React, { useState } from "react";
import { useAuth } from "@clerk/clerk-expo";
import AntDesign from '@expo/vector-icons/AntDesign';
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
    const windowHeight = Dimensions.get('window').height * 0.08;

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
    const response = await fetch("http://localhost:3040/users", {
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
    <ScrollView style={{ flex: 1, backgroundColor: "#f0f0f0" }}>
    <View  style={styles.userContainer} >
      <View  style={styles.Background} >
      <ImageBackground source = {require("../../../assets/images/register-bg.png")} resizeMode="repeat" style = {styles.Img}></ImageBackground>
      <Image source = {require("../../../assets/images/register-user-logo.png")} style = {styles.userIcon}></Image></View>
      <View style = {styles.LabelRegister}> 
        <Text style = {[styles.userWelcome , { marginTop:windowHeight}]}>Bem vindo(a) ao PixelApp</Text>
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
        selectedValue={role}
        style={styles.CargoDropdown}
        onValueChange={(itemValue) => setRole(itemValue)}
      >
        <Picker.Item label="Cargo na Pixel" value="Cargo na Pixel" />
        <Picker.Item label="Trainee" value="Trainee" />
        <Picker.Item label="Efetivo" value="Efetivo" />
        <Picker.Item label="Diretor de Projetos" value="Diretor de Projetos" />
        <Picker.Item label="Diretor de Marketing" value="Diretor de Marketing" />
        <Picker.Item label="Diretor de DH" value="Diretor de DH" />
        <Picker.Item label="Diretor de Comercial" value="Diretor de Comercial" />
        <Picker.Item label="Presidente" value="Presidente" />
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
      </ScrollView>
  )
}

export default RegisterPage;

const styles = StyleSheet.create({
  userIcon: {
    width: 100,
    height: 100,
    borderRadius: 35,
    position: "relative",
    top:50,
    zIndex:10,

  },
  Background:{
    alignItems: "center",
    justifyContent:"center",
    height:170,
  },
  LabelRegister:{
    boxSizing: "border-box",
    alignItems: "center",
    justifyContent: "center",
    flex:6,
  },
  userContainer:{
    flex:1,
  },
  Img:{
      width: "100%",
      height:170,
      flex:1,
  },
  userWelcome: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#693274",
    marginBottom:5,
  },
  CargoDropdown:{
    width:300,
    height:50,
    backgroundColor: "#D9D9D9",
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
    borderBottomLeftRadius: 25,
    borderBottomRightRadius: 25,
    borderWidth: 0,
    color : "#464444ff",
    paddingLeft:10,
    marginBottom:10,
  },
  registerInput:{
    width:300,
    backgroundColor: "#D9D9D9",
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
    borderBottomLeftRadius: 25,
    borderBottomRightRadius: 25,
    marginBottom:15,
  },
  registerInputHolder:{
    alignItems: "center",
    justifyContent:"flex-start",
    backgroundColor: "white",
   
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

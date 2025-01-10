import React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import profileImage from '../../assets/images/profile.png';

export default function Profile() {
  let logado = true;
  if (logado) {
    return (ownProfile());
  } else {
    return (otherProfile());
  }
}

const avatar = () => {
    return (
        <Image
            source={profileImage}
            style={[styles.photo, { borderRadius: 75 }, {marginBottom: 10}]}
            resizeMode='contain'
        />
    );
}

const profile = () => {
    return(
        <View style={styles.container}>
            {avatar()}
            <Text style={styles.title}>Apelido do usuário</Text>
            <Text style={styles.subtitle}> @conta</Text>
            <Text> Bio muito dahora tipo você não tem noção</Text>
        </View>
    )
}

const ownProfile = () => {
    return (
        profile()
    )
}

const otherProfile = () => {
  return (
      <View style={styles.container}>
        <Text>aaa</Text>
      </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  photo: {
    width: 150,
    height: 150,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#fff',
  },
  subtitle: {
    fontSize: 16,
    color: '#bbb',
  },
});

/*
Pessoa 1
    Foto da pessoinha, que ela pode colocar qual quiser
    Nome e bios podem ser alteráveis
    APELIDO!!!

Pessoa 2
    Página dos projetos
    Criar componente de projetos que tem q ter nome, pessoas que estão no projeto e cargos delas
    Mesmo esquema pras diretorias
    DICA: Talvez dê pra fazer os dois do mesmo jeito através da mágica da componentização👀
 */
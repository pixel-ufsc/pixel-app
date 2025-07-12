// isso aqui serve para salvar o token de autenticacao do usuario no dispositivo

import * as SecureStorage from "expo-secure-store";

async function getToken(key: string) {
  try {
    return SecureStorage.getItemAsync(key);
  } catch (error) {
    console.log(error);
  }
}

async function saveToken(key: string, value: string) {
  try {
    return SecureStorage.setItemAsync(key, value);
  } catch (error) {
    console.log(error);
  }
}

export const tokenCache = { getToken, saveToken };
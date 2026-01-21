import { Platform } from "react-native";

/**
 * Faz upload de uma imagem para o Cloudinary
 * @param imageUri - URI local da imagem (file:// ou content://)
 * @returns URL segura da imagem no Cloudinary (secure_url)
 */
export async function uploadImageToCloudinary(imageUri: string): Promise<string> {
  const formData = new FormData();

  if (Platform.OS === "web") {
    // Para web, precisamos converter a URI em um File/Blob
    const response = await fetch(imageUri);
    const blob = await response.blob();
    formData.append("file", blob);
  } else {
    // Para mobile (iOS/Android)
    const filename = imageUri.split("/").pop() || "image.jpg";
    const match = /\.(\w+)$/.exec(filename);
    const type = match ? `image/${match[1]}` : "image/jpeg";

    formData.append("file", {
      uri: imageUri,
      name: filename,
      type: type,
    } as any);
  }

  formData.append("upload_preset", process.env.EXPO_PUBLIC_CLOUDINARY_UPLOAD_PRESET!);
  const cloudName = process.env.EXPO_PUBLIC_CLOUDINARY_CLOUD_NAME!;

  const response = await fetch(
    `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
    {
      method: "POST",
      body: formData,
      // Não definir Content-Type aqui, o browser/formData define automaticamente
    },
  );

  if (!response.ok) {
    let errorMessage = "Erro ao fazer upload da imagem";
    try {
      const error = await response.json();
      errorMessage = error.error?.message || errorMessage;
    } catch (e) {
      errorMessage = `Erro HTTP ${response.status}: ${response.statusText}`;
    }
    throw new Error(errorMessage);
  }

  const data = await response.json();
  
  if (!data.secure_url) {
    throw new Error("Resposta do Cloudinary não contém secure_url");
  }
  
  return data.secure_url;
}


import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { storage } from "./config";

export async function uploadFoto(imagem, path) {
  const filename = imagem.name;
  const imageRef = ref(storage, `${path}/${filename}`);
  const result = await uploadBytes(imageRef, imagem);
  return await getDownloadURL(result.ref);
}
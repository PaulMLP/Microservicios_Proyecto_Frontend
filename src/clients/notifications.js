import axios from "axios";
import store from "@/store";

const API_URL = "http://localhost:7070/app-notificaciones/email/enviar";

const getAuthHeaders = () => ({
  Authorization: `Bearer ${store.getters.getToken}`,
});

export const sendComentarioFachada = async (comentario) => {
  return await sendComentario(comentario);
};

const sendComentario = async (mail) => {
  try {
    const data = await axios
      .post(`${API_URL_EMAIL}/enviar`, mail, { headers: getAuthHeaders() })
      .then((r) => r.data);
    return data;
  } catch (error) {
    console.error("Error creating comment:", error);
    throw error;
  }
};

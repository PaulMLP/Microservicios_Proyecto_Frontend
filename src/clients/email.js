import axios from "axios";
import store from "@/store";

const API_URL = "http://localhost:7070/app-correo/email";

const getAuthHeaders = () => ({
  Authorization: `Bearer ${store.getters.getToken}`,
});

export const sendEmailFachada = async (mail) => {
  return await sendEmail(mail);
};

export const getEmailRegistroCountFachada = async () => {
  return await getEmailRegistroCount();
};

const sendEmail = async (mail) => {
  try {
    const data = await axios
      .post(`${API_URL}/enviar`, mail, { headers: getAuthHeaders() })
      .then((r) => r.data);
    return data;
  } catch (error) {
    console.error("Error creating comment:", error);
    throw error;
  }
};

const getEmailRegistroCount = async () => {
  try {
    const { data } = await axios.get(`${API_URL}/email-registro/count`, {
      headers: getAuthHeaders(),
    });
    return data; // Es un número
  } catch (error) {
    console.error("Error al obtener el conteo:", error);
    throw error;
  }
};

import axios from "axios";
import store from "@/store";

const API_URL = "http://localhost:7070/app-documentos/comentarios";

const getAuthHeaders = () => ({
  Authorization: `Bearer ${store.getters.getToken}`,
});

export const fetchComentariosFachada = async (id) => {
  return await fetchComentarios(id);
};

export const createComentarioFachada = async (comentario) => {
  return await createComentario(comentario);
};

export const deleteComentarioFachada = async (id) => {
  return await deleteComentario(id);
};

const fetchComentarios = async (id) => {
  const url = `${API_URL}/todos/${id}`;
  try {
    const data = await axios
      .get(url, { headers: getAuthHeaders() })
      .then((r) => r.data);
    return data;
  } catch (error) {
    console.error("Error fetching documents:", error);
    throw error;
  }
};

const createComentario = async (comentario) => {
  try {
    const data = await axios
      .post(API_URL, comentario, { headers: getAuthHeaders() })
      .then((r) => r.data);
    return data;
  } catch (error) {
    console.error("Error creating comment:", error);
    throw error;
  }
};

const deleteComentario = async (id) => {
  console.log(`${API_URL}/${id}`);

  try {
    const data = await axios
      .delete(`${API_URL}/${id}`, { headers: getAuthHeaders() })
      .then((r) => r.data);
    return data;
  } catch (error) {
    console.error("Error deleting Comment:", error);
    throw error;
  }
};

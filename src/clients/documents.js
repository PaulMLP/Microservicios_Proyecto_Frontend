import axios from "axios";
import store from "@/store";

const API_URL = "http://localhost:7070/app-documentos/documentos";

const getAuthHeaders = () => ({
  Authorization: `Bearer ${store.getters.getToken}`,
});

export const fetchDocumentosFachada = async (id) => {
  return await fetchDocumentos(id);
};

export const fetchFileFachada = async (id) => {
  return await fetchFile(id);
};

export const createDocumentoFachada = async (documento) => {
  return await createDocumento(documento);
};

export const deleteDocumentoFachada = async (id) => {
  return await deleteDocumento(id);
};

const fetchDocumentos = async (id) => {
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
const fetchFile = async (id) => {
  console.log("Fetching file with ID:", id);

  const url = `${API_URL}/file/${id}`;
  try {
    const data = await axios
      .get(url, { headers: getAuthHeaders() })
      .then((r) => r.data);
    return data;
  } catch (error) {
    console.error("Error fetching file:", error);
    throw error;
  }
};

const createDocumento = async (documento) => {
  try {
    const data = await axios
      .post(API_URL, documento, { headers: getAuthHeaders() })
      .then((r) => r.data);
    return data;
  } catch (error) {
    console.error("Error creating document:", error);
    throw error;
  }
};

const deleteDocumento = async (id) => {
  try {
    const data = await axios
      .delete(`${API_URL}/${id}`, { headers: getAuthHeaders() })
      .then((r) => r.data);
    return data;
  } catch (error) {
    console.error("Error deleting document:", error);
    throw error;
  }
};

import axios from "axios";
import store from "@/store";

/**
 * URL de la API para gestionar los usuarios.
 */
const API_URL = "http://localhost:7070/app-usuarios/usuarios";

/**
 * Retorna los headers con el token actual de Vuex.
 */
const getAuthHeaders = () => ({
  Authorization: `Bearer ${store.getters.getToken}`,
});

/* Fachadas */
export const obtenerTodosUsuariosFachada = async (rol) => {
  return await obtenerTodosUsuarios(rol);
};

export const obtenerUsuarioFachada = async (id) => {
  return await obtenerUsuario(id);
};

export const crearUsuarioFachada = async (usuario) => {
  return await crearUsuario(usuario);
};

export const obtenerUsuarioKeycloakFachada = async (mail) => {
  return await obtenerUsuarioKeycloak(mail);
};

export const actualizarUsuarioFachada = async (usuario) => {
  return await actualizarUsuario(usuario);
};

export const eliminarUsuarioFachada = async (usuario) => {
  return await eliminarUsuario(usuario);
};

export const contarUsuariosRolFachada = async () => {
  return await contarUsuariosRol();
};
export const contarTodosUsuariosFachada = async () => {
  return await contarTodosUsuarios();
};
export const contarUsuariosHoraFachada = async () => {
  return await contarUsuariosHora();
};

/* Lógica interna */
const obtenerTodosUsuarios = async (rol) => {
  const url = rol ? `${API_URL}?rol=${rol}` : API_URL;
  try {
    const data = await axios
      .get(url, { headers: getAuthHeaders() })
      .then((r) => r.data);
    return data;
  } catch (error) {
    console.error("Error fetching users:", error.message);
    throw error;
  }
};

const obtenerUsuarioKeycloak = async (email) => {
  const url = `${API_URL}/keycloak/by-mail/${email}`;
  try {
    const data = await axios
      .get(url, { headers: getAuthHeaders() })
      .then((r) => r.data);
    return data;
  } catch (error) {
    console.error("Error fetching user by email:", error.message);
    throw error;
  }
};

const obtenerUsuario = async (id) => {
  const url = `${API_URL}/${id}`;
  try {
    const data = await axios
      .get(url, { headers: getAuthHeaders() })
      .then((r) => r.data);
    return data;
  } catch (error) {
    console.error("Error fetching user:", error.message);
    throw error;
  }
};

const crearUsuario = async (usuario) => {
  try {
    const data = await axios
      .post(API_URL, usuario, { headers: getAuthHeaders() })
      .then((r) => r.data);
    if (typeof data === "string" && data.includes("409")) return 409;
    return data;
  } catch (error) {
    console.error("Error creating user:", error.message);
    throw error;
  }
};

const actualizarUsuario = async (usuario) => {
  try {
    const url = `${API_URL}/${usuario.id}`;
    const data = await axios
      .put(url, usuario, { headers: getAuthHeaders() })
      .then((r) => r.data);
    return data;
  } catch (error) {
    console.error("Error updating user:", error.message);
    throw error;
  }
};

const eliminarUsuario = async (id) => {
  try {
    const url = `${API_URL}/${id}`;
    const data = await axios
      .delete(url, { headers: getAuthHeaders() })
      .then((r) => r.data);
    return data;
  } catch (error) {
    console.error("Error deleting user:", error.message);
    throw error;
  }
};

const contarUsuariosRol = async () => {
  try {
    const data = await axios
      .get(`${API_URL}/contar-por-rol`, { headers: getAuthHeaders() })
      .then((r) => r.data);
    return data;
  } catch (error) {
    console.error("Error fetching count by rol users:", error.message);
    throw error;
  }
};

const contarTodosUsuarios = async () => {
  try {
    const data = await axios
      .get(`${API_URL}/contar-todos`, { headers: getAuthHeaders() })
      .then((r) => r.data);
    return data;
  } catch (error) {
    console.error("Error fetching count users:", error.message);
    throw error;
  }
};

const contarUsuariosHora = async () => {
  try {
    const data = await axios
      .get(`${API_URL}/conteo-por-hora`, { headers: getAuthHeaders() })
      .then((r) => r.data);
    return data;
  } catch (error) {
    console.error("Error fetching count users by time:", error.message);
    throw error;
  }
};
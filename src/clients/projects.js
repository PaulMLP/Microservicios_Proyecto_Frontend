import axios from "axios";
import store from "@/store";

/**
 * URL de la API para gestionar los usuarios.
 */
const API_URL = "http://localhost:7070/app-proyectos/proyectos";
const API_URL_TAREA = "http://localhost:7070/app-proyectos/tareas";

/**
 * Retorna los headers con el token actual de Vuex.
 */
const getAuthHeaders = () => ({
  Authorization: `Bearer ${store.getters.getToken}`,
});

export const fetchProyectosFachada = async () => {
  return await fetchProyectos();
};

export const fetchTareasFachada = async (id) => {
  return await fetchTareas(id);
};

export const fetchMisTareasFachada = async (id) => {
  return await fetchMisTareas(id);
};

export const fetchProyectoIdFachada = async (id) => {
  return await fetchProyectoId(id);
};

export const fetchProyectosUsuarioFachada = async (userId) => {
  return await fetchProyectosUsuario(userId);
};

export const createProyectoFachada = async (proyecto) => {
  return await createProyecto(proyecto);
};

export const createTareaFachada = async (tarea) => {
  return await createTarea(tarea);
};

export const updateProyectoFachada = async (proyecto) => {
  return await updateProyecto(proyecto);
};

export const updateTareaFachada = async (tarea) => {
  return await updateTarea(tarea);
};

export const deleteProyectoFachada = async (id) => {
  return await deleteProyecto(id);
};

export const deleteTareaFachada = async (id) => {
  return await deleteTarea(id);
};

const fetchProyectos = async () => {
  try {
    const data = await axios
      .get(API_URL, { headers: getAuthHeaders() })
      .then((r) => r.data);
    return data;
  } catch (error) {
    console.error("Error fetching proyectos:", error);
    throw error;
  }
};
const fetchTareas = async (id) => {
  try {
    const data = await axios
      .get(`${API_URL_TAREA}/${id}`, { headers: getAuthHeaders() })
      .then((r) => r.data);
    return data;
  } catch (error) {
    console.error("Error fetching tasks:", error);
    throw error;
  }
};

const fetchMisTareas = async (id) => {
  try {
    const data = await axios
      .get(`${API_URL_TAREA}/mis-tareas/${id}`, { headers: getAuthHeaders() })
      .then((r) => r.data);
    return data;
  } catch (error) {
    console.error("Error fetching tasks:", error);
    throw error;
  }
};

const fetchProyectoId = async (id) => {
  try {
    const data = await axios
      .get(`${API_URL}/${id}`, { headers: getAuthHeaders() })
      .then((r) => r.data);
    return data;
  } catch (error) {
    console.error(`Error fetching proyecto con id ${id}:`, error);
    throw error;
  }
};

const fetchProyectosUsuario = async (userId) => {
  const url = `${API_URL}/mis-proyectos/${userId}`;

  try {
    const data = await axios
      .get(url, { headers: getAuthHeaders() })
      .then((r) => r.data);
    return data;
  } catch (error) {
    console.error("Error fetching proyectos:", error);
    throw error;
  }
};

const createProyecto = async (proyecto) => {
  try {
    const data = await axios
      .post(API_URL, proyecto, { headers: getAuthHeaders() })
      .then((r) => r.data);
    console.log(data);

    return data;
  } catch (error) {
    console.error("Error creating proyecto:", error);
    throw error;
  }
};

const createTarea = async (tarea) => {
  try {
    const data = await axios
      .post(API_URL_TAREA, tarea, { headers: getAuthHeaders() })
      .then((r) => r.data);
    console.log(data);

    return data;
  } catch (error) {
    console.error("Error creating tarea:", error);
    throw error;
  }
};

const updateProyecto = async (proyecto) => {
  delete proyecto.responsableNombre;

  try {
    const data = await axios
      .put(`${API_URL}/${proyecto.id}`, proyecto, { headers: getAuthHeaders() })
      .then((r) => r.data);
    return data;
  } catch (error) {
    console.error("Error updating proyecto:", error);
    throw error;
  }
};

const updateTarea = async (tarea) => {
  console.log(tarea);

  try {
    const data = await axios
      .put(`${API_URL_TAREA}/${tarea.id}`, tarea, { headers: getAuthHeaders() })
      .then((r) => r.data);
    return data;
  } catch (error) {
    console.error("Error updating task:", error);
    throw error;
  }
};

const deleteProyecto = async (id) => {
  try {
    const data = await axios
      .delete(`${API_URL}/${id}`, { headers: getAuthHeaders() })
      .then((r) => r.data);
    return data;
  } catch (error) {
    console.error("Error deleting proyecto:", error);
    throw error;
  }
};

const deleteTarea = async (id) => {
  try {
    const data = await axios
      .delete(`${API_URL_TAREA}/${id}`, { headers: getAuthHeaders() })
      .then((r) => r.data);
    return data;
  } catch (error) {
    console.error("Error deleting tarea:", error);
    throw error;
  }
};

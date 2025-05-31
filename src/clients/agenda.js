import axios from "axios";
import store from "@/store";

const API_URL = "http://localhost:7070/app-agenda/eventos";

const getAuthHeaders = () => ({
  Authorization: `Bearer ${store.getters.getToken}`,
});

export const crearEventoFachada = async (evento) => {
  return await crearEvento(evento);
};

export const fetchEventosAsignadosFachada = async (asignadoId) => {
  return await fetchEventosAsignados(asignadoId);
};

export const fetchEventosCreadosFachada = async (responsableId) => {
  return await fetchEventosCreados(responsableId);
};

export const fetchUsuariosAsignadosFachada = async (eventoId) => {
  return await fetchUsuariosAsignados(eventoId);
};

export const updateEventoFachada = async (evento) => {
  return await updateEvento(evento);
};

export const deleteEventoFachada = async (id) => {
  return await deleteEvento(id);
};

export const contarTodosEventosFachada = async () => {
  return await contarTodosEventos();
};

const crearEvento = async (evento) => {
  try {
    const data = await axios
      .post(API_URL, evento, { headers: getAuthHeaders() })
      .then((r) => r.data);
    return data;
  } catch (error) {
    console.error("Error creating event:", error);
    throw error;
  }
};

const fetchEventosAsignados = async (asignadoId) => {
  const url = `${API_URL}/asignados/${asignadoId}`;
  try {
    const data = await axios
      .get(url, { headers: getAuthHeaders() })
      .then((r) => r.data);
    return data;
  } catch (error) {
    console.error("Error fetching eventos asignados:", error);
    throw error;
  }
};

const fetchEventosCreados = async (responsableId) => {
  const url = `${API_URL}/creados/${responsableId}`;
  try {
    const data = await axios
      .get(url, { headers: getAuthHeaders() })
      .then((r) => r.data);
    return data;
  } catch (error) {
    console.error("Error fetching eventos creados:", error);
    throw error;
  }
};

const fetchUsuariosAsignados = async (eventoId) => {
  const url = `${API_URL}/usuarios-asignados/${eventoId}`;
  try {
    const data = await axios
      .get(url, { headers: getAuthHeaders() })
      .then((r) => r.data);
    return data;
  } catch (error) {
    console.error("Error fetching asignados:", error);
    throw error;
  }
};

const updateEvento = async (evento) => {
  try {
    const data = await axios
      .put(`${API_URL}/${evento.id}`, evento, { headers: getAuthHeaders() })
      .then((r) => r.data);
    return data;
  } catch (error) {
    console.error("Error updating event:", error);
    throw error;
  }
};

const deleteEvento = async (id) => {
  try {
    const data = await axios
      .delete(`${API_URL}/${id}`, { headers: getAuthHeaders() })
      .then((r) => r.data);
    return data;
  } catch (error) {
    console.error("Error deleting event:", error);
    throw error;
  }
};

const contarTodosEventos = async () => {
  try {
    const data = await axios
      .get(`${API_URL}/contar-todos`, { headers: getAuthHeaders() })
      .then((r) => r.data);
    return data;
  } catch (error) {
    console.error("Error fetching count agenda:", error.message);
    throw error;
  }
};
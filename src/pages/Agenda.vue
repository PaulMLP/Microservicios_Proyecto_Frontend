<template>
  <div>
    <button
      v-if="role === 'responsable'"
      id="button-agregar"
      v-show="!show_form"
      @click="addEvent"
    >
      Agendar Evento <span class="ti-plus"></span>
    </button>
    <div v-if="!show_agenda" class="spinner-container">
      <div class="spinner"></div>
    </div>
    <div v-else class="row">
      <div v-if="show_form" class="col-12">
        <div class="card-header col-12">
          <button class="exit" @click="exit">
            <span class="ti-close"></span>
          </button>
        </div>
        <form v-if="show_form" @submit.prevent="save" class="col-12">
          <div class="row">
            <div class="col-12">
              <fg-input
                type="text"
                label="Título"
                placeholder="Título"
                v-model="eventoAux.titulo"
                required
              />
            </div>
            <div class="col-12">
              <div class="form-group">
                <label>Descripción</label>
                <textarea
                  rows="2"
                  class="form-control border-input"
                  placeholder="Aquí puede estar la descripción"
                  v-model="eventoAux.descripcion"
                  required
                ></textarea>
              </div>
            </div>
            <div class="col-6">
              <fg-input
                type="datetime-local"
                label="Fecha Vencimiento"
                placeholder="Fecha Vencimiento"
                v-model="eventoAux.fechaInicio"
                required
              />
            </div>
            <div class="col-md-6">
              <fg-input
                type="datetime-local"
                label="Fecha Vencimiento"
                placeholder="Fecha Vencimiento"
                v-model="eventoAux.fechaFin"
                required
              />
            </div>
            <div v-if="users_await" class="spinner-container col-12">
              <div class="spinner"></div>
            </div>
            <div v-else class="form-group col-12">
              <label>Investigadores</label>
              <multiselect
                v-model="eventoAux.asignados"
                :options="asignados"
                label="nombre"
                track-by="id"
                placeholder="Selecciona investigadores"
                :multiple="true"
                :select-label="'Click o enter para seleccionar'"
                :deselect-label="'Click o enter para eliminar'"
              ></multiselect>
            </div>
            <span v-if="errores.asignados" class="text-danger"
              >Debe seleccionar al menos un investigador.</span
            >
          </div>
          <div class="col-md-12 botones">
            <p-button type="info" native-type="submit">
              <span class="ti-save"></span>
              <span style="margin-left: 5px">Guardar</span>
            </p-button>

            <p-button
              v-if="eventoAux.id"
              type="primary"
              @click.native.prevent="save"
            >
              <span class="ti-reload"></span>
              <span style="margin-left: 5px">Actualizar</span>
            </p-button>
            <p-button
              v-if="eventoAux.id"
              type="default"
              @click.native.prevent="drop"
            >
              <span class="ti-trash"></span>
              <span style="margin-left: 5px">Eliminar</span>
            </p-button>
          </div>
        </form>
      </div>

      <div v-else class="col-xl-12">
        <div v-if="eventos.length == 0">
          <h3>No hay eventos agendados</h3>
        </div>
        <div v-else v-for="evento in eventos" @click="open(evento)">
          <card
            id="tarjeta"
            :title="evento.titulo"
            :subTitle="evento.descripcion"
          >
            <template #default>
              <div class="fechas">
                <div>
                  <span class="text-info">Inicio del evento: </span>
                  <small>{{ formatDate(evento.fechaInicio) }}</small>
                </div>
                <div>
                  <span class="ti-angle-double-right"></span>
                </div>
                <div>
                  <span class="text-info">Fin del evento: </span>
                  <small>{{ formatDate(evento.fechaFin) }}</small>
                </div>
              </div>
            </template>

            <template #footer>
              <div>
                <p>
                  {{ calcularDiasRestantes(evento.fechaInicio) }}
                </p>
              </div>
            </template>
          </card>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import Multiselect from "vue-multiselect";
import { obtenerTodosUsuariosFachada } from "@/clients/users.js";
import { sendEmailFachada } from "@/clients/email.js";

import {
  crearEventoFachada,
  fetchEventosAsignadosFachada,
  fetchEventosCreadosFachada,
  fetchUsuariosAsignadosFachada,
  updateEventoFachada,
  deleteEventoFachada,
} from "@/clients/agenda.js";
export default {
  components: {
    Multiselect,
  },
  data() {
    return {
      show_agenda: false,
      show_form: false,
      asignados: [],
      users_await: true,
      eventoAux: {
        id: null,
        titulo: null,
        descripcion: null,
        fechaInicio: null,
        fechaFin: null,
        usuarioId: null,
        asignados: [],
      },
      userDB: null,
      eventos: [],
      errores: {
        asignados: false,
      },
      role: null,
      userId: null,
    };
  },
  mounted() {
    this.userDB = this.$store.state.userDbData;
    this.fetchEvents();
  },
  methods: {
    async save() {
      this.errores.asignados = this.eventoAux.asignados.length === 0;

      // Si hay errores, no continúa
      if (this.errores.asignados) {
        return;
      }

      try {
        // Construir usuarioIds
        const investigadoresIds = this.eventoAux.asignados.map((inv) => inv.id);

        // Crear objeto limpio para guardar
        const eventoGuardar = this.eventoAux;

        eventoGuardar.usuarioId = this.userId;
        eventoGuardar.asignados = investigadoresIds;

        if (this.eventoAux.id) {
          // Actualizar el proyecto existente
          this.show_form = false;
          this.show_agenda = false;
          await updateEventoFachada(eventoGuardar);
        } else {
          await crearEventoFachada(eventoGuardar);
        }
        this.notificarInvestigadores(
          `Se ha agendado un nuevo evento: ${eventoGuardar.descripcion} \n
          Empieza el ${this.formatDate(eventoGuardar.fechaInicio)} y termina el ${this.formatDate(eventoGuardar.fechaFin)}`,
        );
        this.clean();
        this.show_form = false;
        this.fetchEvents();
      } catch (error) {
        console.error("Error guardando evento:", error);
        alert("Error al agendar evento. Revisa la consola.");
      }
    },

    notificarInvestigadores(cuerpo) {
      this.eventoAux.asignados.forEach((user) => {
        const mail = {
          para: user.correo,
          asunto: this.eventoAux.titulo,
          mensaje: cuerpo,
          servicio: "Agenda_Eventos",
        };
        try {
          sendEmailFachada(mail);
        } catch (error) {
          console.log(error);
        }
      });
    },

    async addEvent() {
      this.show_form = true;
      this.users_await = true;
      this.asignados = await obtenerTodosUsuariosFachada("investigador");
      if (this.asignados) {
        this.users_await = false;
      }
    },

    async fetchEvents() {
      this.show_agenda = false;
      const { rol, id } = this.userDB;
      this.role = rol;
      this.userId = id;
      try {
        if (rol === "responsable") {
          this.eventos = await fetchEventosCreadosFachada(id);
        } else if (rol === "investigador") {
          this.eventos = await fetchEventosAsignadosFachada(id);
        }

        if (this.eventos && this.eventos.length > 0) {
          this.show_agenda = true;
        }
        if (this.eventos.length == 0) {
          this.show_agenda = true;
        }
      } catch (error) {
        console.error("Error al obtener los eventos:", error);
      }
    },

    formatDate(date) {
      return new Date(date).toLocaleString("es-ES", {
        weekday: "short",
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    },

    async open(evento) {
      if (this.role === "responsable") {
        this.show_form = true;
        this.eventoAux = {
          id: evento.id,
          titulo: evento.titulo,
          descripcion: evento.descripcion,
          fechaInicio: this.cambiarFecha(evento.fechaInicio),
          fechaFin: this.cambiarFecha(evento.fechaFin),
          usuarioId: evento.usuarioId,
          asignados: [],
        };
        this.users_await = true;

        // Carga todos los usuarios disponibles una sola vez
        this.asignados = await obtenerTodosUsuariosFachada("investigador");
        const usuariosAsignadosRaw = await fetchUsuariosAsignadosFachada(
          this.eventoAux.id,
        );
        this.eventoAux.asignados = usuariosAsignadosRaw
          .map((item) => this.asignados.find((u) => u.id === item.usuarioId))
          .filter(Boolean);

        this.users_await = false;
      }
    },

    async drop() {
      this.show_agenda = false;
      this.show_form = false;
      await deleteEventoFachada(this.eventoAux.id);
      this.clean();
      this.fetchEvents();
    },

    exit() {
      const resultado = confirm("¿Estás seguro de que quieres salir?");
      if (resultado) {
        this.clean();
        this.show_form = false;
      }
    },

    clean() {
      this.eventoAux = {
        id: null,
        titulo: null,
        descripcion: null,
        fechaInicio: null,
        fechaFin: null,
        usuarioId: null,
        asignados: [],
      };
    },

    cambiarFecha(fecha) {
      if (!fecha) return "";
      const d = new Date(fecha);

      const pad = (n) => n.toString().padStart(2, "0");

      const year = d.getFullYear();
      const month = pad(d.getMonth() + 1);
      const day = pad(d.getDate());
      const hours = pad(d.getHours());
      const minutes = pad(d.getMinutes());

      return `${year}-${month}-${day}T${hours}:${minutes}`;
    },
    calcularDiasRestantes(fechaFin) {
      const ahora = new Date();
      const vencimiento = new Date(fechaFin);

      const diferenciaMs = vencimiento - ahora;

      if (diferenciaMs < 0) {
        // Evento ya pasó, mostramos días y horas desde que terminó
        const dias = Math.floor(Math.abs(diferenciaMs) / (1000 * 60 * 60 * 24));
        const horas = Math.floor(
          (Math.abs(diferenciaMs) % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60),
        );
        let resultado = `Terminó hace `;
        if (dias > 0) resultado += `${dias} día(s) `;
        if (horas > 0) resultado += `${horas} hora(s) `;
        return resultado.trim();
      } else {
        // Evento aún no ha pasado, mostramos días y horas restantes
        const dias = Math.floor(diferenciaMs / (1000 * 60 * 60 * 24));
        const horas = Math.floor(
          (diferenciaMs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60),
        );

        if (dias === 0 && horas === 0) {
          return "El evento es ahora";
        }
        let resultado = `Faltan `;
        if (dias > 0) resultado += `${dias} día(s) `;
        if (horas > 0) resultado += `${horas} hora(s) `;
        return resultado.trim();
      }
    },
  },
};
</script>
<style scoped>
@import "~vue-multiselect/dist/vue-multiselect.min.css";
.fechas {
  display: flex;
  flex-direction: row;
  gap: 10px;
}
.card-header {
  display: flex;
  justify-content: end;
  align-items: center;
  background-color: transparent;
  padding: 0;
  border: none;
}
</style>

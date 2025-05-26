<template>
  <div v-if="tasks_await" class="spinner-container">
    <div class="spinner"></div>
  </div>
  <div v-else>
    <div v-if="!view_task" class="tasks">
      <button id="button-agregar" @click="view_task = true">
        Agregar Tarea <span class="ti-plus"></span>
      </button>
      <h6 class="text-sm text-gray-600">
        Arrastra las tareas entre columnas para cambiar su estado.
      </h6>
      <div class="row gap-0">
        <KanbanColumn
          class="col-md-4 mb-4"
          v-if="tareas"
          v-for="estado in estados"
          :key="estado"
          :estado="estado"
          :tareas="tareasPorEstado(estado)"
          @mover-tarea="moverTarea"
          @getTarea="openTask"
        />
      </div>
    </div>
    <div v-else class="form-task">
      <div class="card-header">
        <button class="exit" @click="exit">
          <span class="ti-close"></span>
        </button>
      </div>
      <form @submit.prevent="save">
        <div class="row">
          <div class="col-md-6">
            <div class="form-group">
              <label>Descripción</label>
              <textarea
                rows="2"
                class="form-control border-input"
                placeholder="Aquí puede estar la descripción"
                v-model="tareaAux.descripcion"
                required
              ></textarea>
            </div>
          </div>
          <div class="col-md-6">
            <fg-input
              type="date"
              label="Fecha Vencimiento"
              placeholder="Fecha Vencimiento"
              v-model="tareaAux.fechaVencimiento"
              required
            />
          </div>
          <div v-if="users_await" class="spinner-container">
            <div class="spinner"></div>
          </div>
          <div v-else class="form-group col-md-6">
            <label>Investigadores</label>
            <multiselect
              v-model="tareaAux.usuarios"
              :options="usuariosProyecto"
              label="nombre"
              track-by="id"
              placeholder="Selecciona investigadores"
              :multiple="true"
              :select-label="'Click o enter para seleccionar'"
              :deselect-label="'Click o enter para eliminar'"
            ></multiselect>
          </div>
          <span v-if="errores.investigadores" class="text-danger"
            >Debe seleccionar al menos un investigador.</span
          >
        </div>
        <div class="col-md-12 botones">
          <p-button type="info" native-type="submit">
            <span class="ti-save"></span>
            <span style="margin-left: 5px">Guardar</span>
          </p-button>

          <p-button
            v-if="tareaAux.id"
            type="primary"
            @click.native.prevent="drop"
          >
            <span class="ti-trash"></span>
            <span style="margin-left: 5px">Eliminar</span>
          </p-button>
        </div>
      </form>
    </div>
  </div>
</template>

<script>
import Multiselect from "vue-multiselect";
import KanbanColumn from "./Board/KanbanColumn.vue";
import {
  fetchTareasFachada,
  createTareaFachada,
  updateTareaFachada,
  deleteTareaFachada,
} from "@/clients/projects.js";
import { sendComentarioFachada } from "@/clients/comments.js";
import { obtenerUsuarioFachada } from "@/clients/users.js";
import { cambiarFecha } from "@/utils/methods";
export default {
  props: {
    project: Object,
  },
  components: {
    KanbanColumn,
    Multiselect,
  },
  data() {
    return {
      estados: ["Pendiente", "En progreso", "Completado"],
      tasks_await: false,
      users_await: false,
      tareaAux: [],
      tareas: null,
      view_task: false,
      usuariosProyecto: null,
      errores: {
        investigadores: false,
      },
    };
  },
  mounted() {
    this.fetchAllTasks();
    this.usuariosProyecto = this.project.usuarios.filter(
      (user) => user.rol === "investigador",
    );
  },
  methods: {
    async save() {
      this.errores.investigadores = this.tareaAux.usuarios.length === 0;

      // Si hay errores, no continúa
      if (this.errores.investigadores) {
        return;
      }
      const tareaUpdate = {
        id: this.tareaAux.id,
        descripcion: this.tareaAux.descripcion,
        estado: "Pendiente",
        fechaAsignacion: new Date().toISOString().slice(0, 10),
        fechaVencimiento: this.tareaAux.fechaVencimiento,
        proyectoId: this.project.id,
        usuarioIds: this.tareaAux.usuarios.map((user) => user.id),
      };
      if (this.tareaAux.id) {
        await updateTareaFachada(tareaUpdate);
      } else {
        delete tareaUpdate.id;
        await createTareaFachada(tareaUpdate);
      }
      const mail = {
        para: "merizaldeleo@gmail.com",
        asunto: this.project.titulo,
        mensaje: tareaUpdate.descripcion,
      };
      sendComentarioFachada(mail);
      this.clean();
      this.fetchAllTasks();
    },

    async drop() {
      this.tasks_await = true;
      await deleteTareaFachada(this.tareaAux.id);
      this.fetchAllTasks();
    },

    async fetchAllTasks() {
      this.tasks_await = true;
      this.tareas = [];
      this.tareas = await fetchTareasFachada(this.project.id);
      this.tasks_await = this.tareas ? false : true;

      this.view_task = false;
    },

    tareasPorEstado(estado) {
      const res = this.tareas.filter((t) => t.estado === estado);

      return res;
    },

    moverTarea({ tareaId, nuevoEstado }) {
      const tarea = this.tareas.find((t) => t.id === tareaId);
      if (tarea) {
        tarea.estado = nuevoEstado;
      }
      updateTareaFachada(tarea);
    },

    async openTask(tarea) {
      this.users_await = true;
      this.tareaAux = null;
      this.view_task = true;
      this.tareaAux = tarea;
      this.tareaAux.fechaVencimiento = this.cambiarFecha(
        this.tareaAux.fechaVencimiento,
      );
      try {
        const usuariosCompletos = await Promise.all(
          tarea.usuarios.map((id) => obtenerUsuarioFachada(id)),
        );

        this.tareaAux.usuarios = usuariosCompletos;
        if (this.tareaAux.usuarios) this.users_await = false;
      } catch (error) {
        console.error("Error al cargar usuarios:", error);
        this.tareaAux.usuarios = [];
      }
    },
    exit() {
      this.view_task = false;
    },
    clean() {
      this.tareaAux = [];
      this.errores = {
        investigadores: false,
      };
    },
    cambiarFecha,
  },
};
</script>
<style scoped>
@import "~vue-multiselect/dist/vue-multiselect.min.css";
.tasks {
  border-top: solid 3px #dee2e6;
  padding-top: 1rem;
}

.form-task {
  background-color: #ebebeb;
  padding: 20px;
  border-radius: 5px;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.2);
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

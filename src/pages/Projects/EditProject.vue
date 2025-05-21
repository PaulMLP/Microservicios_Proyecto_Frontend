<template>
  <div v-if="update_await" class="spinner-container">
    <div class="spinner"></div>
  </div>
  <card v-else class="card">
    <div class="card-header">
      <button class="exit" @click="exit"><span class="ti-close"></span></button>
    </div>

    <div>
      <form @submit.prevent="save">
        <div class="row">
          <div class="col-md-8">
            <fg-input
              type="text"
              label="Título"
              placeholder="Título"
              v-model="projectAux.titulo"
              required
            />
          </div>
          <div class="col-md-4">
            <label for="estado">Estado</label>
            <select
              id="estado"
              v-model="projectAux.estado"
              class="form-control"
              required
            >
              <option value="" disabled>Selecciona estado</option>
              <option value="en_progreso">En progreso</option>
              <option value="finalizado">Finalizado</option>
              <option value="pendiente">Pendiente</option>
            </select>
          </div>
        </div>

        <div class="row mt-3">
          <div class="col-md-12">
            <div class="form-group">
              <label>Descripción</label>
              <textarea
                rows="5"
                class="form-control border-input"
                placeholder="Aquí puede estar la descripción"
                v-model="projectAux.descripcion"
                required
              ></textarea>
            </div>
          </div>
        </div>

        <div class="row mt-3">
          <div class="col-md-6">
            <fg-input
              type="date"
              label="Fecha Inicio"
              placeholder="Fecha Inicio"
              v-model="projectAux.fechaInicio"
              required
            />
          </div>
          <div class="col-md-6">
            <fg-input
              type="date"
              label="Fecha Fin"
              placeholder="Fecha Fin"
              v-model="projectAux.fechaFin"
              required
            />
          </div>
        </div>
        <div class="col-md-12">
          <div class="form-group">
            <label>Responsable</label>
            <multiselect
              v-model="projectAux.responsable"
              :options="usuariosResponsables"
              label="nombre"
              track-by="id"
              placeholder="Selecciona responsable"
              :multiple="false"
              :select-label="'Click o enter para seleccionar'"
              :deselect-label="'Click o enter para eliminar'"
              :selected-label="'Seleccionado'"
            ></multiselect>
          </div>
          <div class="form-group">
            <label>Investigadores</label>
            <multiselect
              v-model="projectAux.investigadores"
              :options="usuariosInvestigadores"
              label="nombre"
              track-by="id"
              placeholder="Selecciona investigadores"
              :multiple="true"
              :select-label="'Click o enter para seleccionar'"
              :deselect-label="'Click o enter para eliminar'"
              :selected-label="seleccionados"
            ></multiselect>
          </div>
        </div>

        <div
          class="row mt-3 w-100 flex justify-content-center flex-column align-items-center text-center"
        >
          <span v-if="errores.responsable" class="text-danger"
            >Debe seleccionar un responsable.</span
          >
          <span v-if="errores.responsable" class="text-danger"
            >Debe seleccionar al menos un investigador.</span
          >
        </div>

        <div
          class="text-center mt-4"
          style="display: flex; justify-content: center; gap: 5px"
        >
          <p-button v-if="!project" type="info" native-type="submit">
            <span class="ti-save"></span>
            <span style="margin-left: 5px">Guardar</span>
          </p-button>
          <p-button v-else type="info" native-type="submit">
            <span class="ti-reload"></span>
            <span style="margin-left: 5px">Actualizar</span>
          </p-button>

          <p-button v-if="!project" type="danger" @click.native.prevent="clean">
            <span class="ti-trash"></span>
            <span style="margin-left: 5px">Limpiar</span>
          </p-button>
        </div>
        <div class="clearfix"></div>
      </form>
    </div>
  </card>
</template>

<script>
import Multiselect from "vue-multiselect";
import { obtenerTodosUsuariosFachada } from "@/clients/users.js";
import {
  createProyectoFachada,
  updateProyectoFachada,
} from "@/clients/projects.js";
import { cambiarFecha } from "@/utils/methods.js";

export default {
  components: {
    Multiselect,
  },
  props: {
    project: Object,
  },
  data() {
    return {
      update_await: false,
      projectAux: this.project || {
        id: null,
        titulo: "",
        descripcion: "",
        estado: "",
        fechaInicio: "",
        fechaFin: "",
        responsable: null,
        investigadores: [],
        usuarioIds: [],
      },
      usuariosResponsables: [],
      usuariosInvestigadores: [],
      errores: {
        responsable: false,
        investigadores: false,
      },
    };
  },
  async mounted() {
    if (this.project) {
      this.projectAux = {
        ...this.project,
        fechaInicio: cambiarFecha(this.project.fechaInicio),
        fechaFin: cambiarFecha(this.project.fechaFin),
        responsable: this.project.usuarios.find((u) => u.rol === "responsable"),
        investigadores: this.project.usuarios.filter(
          (u) => u.rol === "investigador",
        ),
      };
    }

    this.usuariosResponsables =
      await obtenerTodosUsuariosFachada("responsable");
    this.usuariosInvestigadores =
      await obtenerTodosUsuariosFachada("investigador");
  },
  methods: {
    async save() {
      // Resetear errores
      this.errores.responsable = !this.projectAux.responsable;
      this.errores.investigadores = this.projectAux.investigadores.length === 0;

      // Si hay errores, no continúa
      if (this.errores.responsable || this.errores.investigadores) {
        return;
      }

      try {
        // Construir usuarioIds
        const responsableId = this.projectAux.responsable.id;
        const investigadoresIds = this.projectAux.investigadores.map(
          (inv) => inv.id,
        );

        const usuarioIds = [responsableId, ...investigadoresIds];

        // Crear objeto limpio para guardar
        const proyectoAGuardar = {
          ...this.projectAux,
          usuarioIds,
        };

        // Eliminar campos no deseados
        delete proyectoAGuardar.responsable;
        delete proyectoAGuardar.investigadores;
        delete proyectoAGuardar.usuarios;

        if (this.project) {
          proyectoAGuardar.id = this.project.id;

          // Actualizar el proyecto existente
          this.update_await = true;
          await updateProyectoFachada(proyectoAGuardar);
        } else {
          await createProyectoFachada(proyectoAGuardar);
        }

        this.$emit("refresh");
        this.$emit("saved", true);
      } catch (error) {
        console.error("Error guardando proyecto:", error);
        alert("Error al guardar proyecto. Revisa la consola.");
      }
    },

    exit() {
      const resultado = confirm("¿Estás seguro de que quieres salir?");
      if (resultado) {
        this.clean(false);
        this.$emit("saved", true);
      }
    },
    clean(type) {
      if (type) {
        if (
          !confirm(
            "¿Estás seguro de que quieres limpiar los campos del formulario?",
          )
        ) {
          return;
        }
      }

      this.projectAux = {
        id: null,
        titulo: "",
        descripcion: "",
        estado: "",
        fechaInicio: "",
        fechaFin: "",
        responsable: null,
        investigadores: [],
        usuarioIds: [],
      };
    },
  },
};
</script>

<style scoped>
@import "~vue-multiselect/dist/vue-multiselect.min.css";

.card-header {
  display: flex;
  justify-content: end;
  align-items: center;
  padding: 1%;
}

.exit {
  background-color: gainsboro;
  border: none;
  padding: 4px 8px;
  cursor: pointer;
  font-size: 15px;
  border-radius: 5px;
  color: #000;
  box-shadow: 0 0 5px rgba(0, 0, 0, 0.2);
}

.exit:hover {
  background-color: #d5d5d5;
  transition: all 0.2s ease;
}

.text-danger {
  color: #e7372b;
  font-size: 13px;
  margin-top: 4px;
  display: block;
}

.spinner-container {
  width: 100px;
  height: 100px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.spinner {
  width: 40px;
  height: 40px;
  border: 4px solid #ccc;
  border-top: 4px solid #3498db;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}
</style>

<template>
  <card class="card">
    <div class="card-header">
      <button class="exit" @click="exit"><span class="ti-close"></span></button>
    </div>
    <div>
      <div v-if="update_await" class="spinner-container">
        <div class="spinner"></div>
      </div>
      <form v-else @submit.prevent>
        <div class="row">
          <div class="col-md-6">
            <fg-input
              :required="true"
              :disabled="userAux.id"
              type="text"
              label="Usuario"
              placeholder="Usuario"
              v-model="userAux.username"
              :error="errors.username"
            />
          </div>
          <div class="col-md-6">
            <fg-input
              :required="true"
              type="email"
              label="Correo"
              placeholder="example@mail.com"
              v-model="userAux.email"
              :error="errors.email"
            />
          </div>
        </div>

        <div class="row">
          <div class="col-md-6">
            <fg-input
              :required="true"
              type="text"
              label="Nombre"
              placeholder="Nombre"
              v-model="userAux.firstName"
              :error="errors.firstName"
            />
          </div>
          <div class="col-md-6">
            <fg-input
              :required="true"
              type="text"
              label="Apellido"
              placeholder="Apellido"
              v-model="userAux.lastName"
              :error="errors.lastName"
            />
          </div>
        </div>

        <div class="row">
          <div class="col-6">
            <label>Provincia</label>
            <select
              class="form-control"
              v-model="userAux.provincia"
              @change="actualizarCiudades"
            >
              <option disabled value="">Selecciona una provincia</option>
              <option
                v-for="provincia in provincias"
                :key="provincia.nombre"
                :value="provincia.nombre"
              >
                {{ provincia.nombre }}
              </option>
            </select>
          </div>

          <div class="col-6">
            <label>Ciudad</label>
            <select
              class="form-control"
              v-model="userAux.ciudad"
              :disabled="ciudadesFiltradas.length === 0"
            >
              <option disabled value="">Selecciona una ciudad</option>
              <option
                v-for="ciudad in ciudadesFiltradas"
                :key="ciudad"
                :value="ciudad"
              >
                {{ ciudad }}
              </option>
            </select>
            <small class="text-danger">
              {{ errors.ciudad }}
            </small>
          </div>
        </div>

        <div class="row">
          <div class="col-6">
            <fg-input
              type="text"
              label="Teléfono"
              placeholder="Teléfono"
              v-model="userAux.telefono"
              :error="errors.telefono"
            ></fg-input>
          </div>
          <div class="col-6">
            <fg-input
              type="text"
              label="Último Acceso"
              :disabled="true"
              v-model="userAux.ultimoAcceso"
            ></fg-input>
          </div>
        </div>

        <div class="row">
          <div class="col-md-6">
            <fg-input
              :required="true"
              type="text"
              :disabled="true"
              label="Rol"
              placeholder="Rol"
              v-model="userAux.rol"
            />
          </div>
        </div>
        <small v-if="mensaje" class="text-danger">{{ mensaje }}</small>
        <div
          class="text-center"
          style="display: flex; justify-content: center; gap: 5px"
        >
          <p-button type="info" @click.native.prevent="save">
            <span class="ti-save"></span>
            <span style="margin-left: 5px">Guardar</span>
          </p-button>

          <p-button v-if="user" type="default" @click.native.prevent="drop">
            <span class="ti-trash"></span>
            <span style="margin-left: 5px">Eliminar</span>
          </p-button>
        </div>

        <div class="clearfix"></div>
      </form>
    </div>
  </card>
</template>

<script>
import {
  crearUsuarioFachada,
  eliminarUsuarioFachada,
  actualizarUsuarioFachada,
  obtenerUsuarioByMailFachada,
} from "@/clients/users.js";
import { fetchIdsProjResponsableFachada } from "@/clients/projects.js";
import {
  fetchEventosCreadosFachada,
  fetchEventosAsignadosFachada,
} from "@/clients/agenda.js";

import { sendEmailFachada } from "@/clients/email.js";
export default {
  props: {
    role: String,
    user: Object,
  },
  data() {
    return {
      update_await: false,
      provincias: [],
      ciudadesFiltradas: [],
      userToSave: this.user,
      userAux: this.user || {
        username: null,
        firstName: "",
        lastName: "",
        email: "",
        password: "",
        rol: this.role,
        telefono: "",
        ciudad: "",
        provincia: "",
        ultimoAcceso: "",
        activo: false,
      },
      mensaje: "",
      errors: {},
    };
  },
  async mounted() {
    const response = await fetch("/data/provincias.json");
    this.provincias = await response.json();
    if (this.userAux.id) {
      const userDB = await obtenerUsuarioByMailFachada(this.userAux.email);
      this.userAux = {
        id: this.user.id,
        username: this.userAux.username,
        firstName: this.userAux.firstName,
        lastName: this.userAux.lastName,
        email: this.userAux.email,
        rol: this.role,
        telefono: userDB.telefono || "",
        ciudad: userDB.ciudad || "",
        provincia: userDB.provincia || "",
        ultimoAcceso: userDB.ultimoAcceso || "",
        activo: userDB.activo || false,
      };

      if (this.userAux.provincia) {
        this.actualizarCiudades();
      }
    }
  },
  methods: {
    save() {
      this.errors = {}; // Limpiar errores

      if (!this.userAux.username.trim()) {
        this.errors.username = "Usuario es requerido.";
      } else if (/\s/.test(this.userAux.username)) {
        this.errors.username = "El usuario no debe contener espacios.";
      }

      if (!this.userAux.firstName.trim()) {
        this.errors.firstName = "Nombre es requerido.";
      } else if (/\s/.test(this.userAux.firstName)) {
        this.errors.firstName = "El nombre no debe contener espacios.";
      }

      if (!this.userAux.lastName.trim()) {
        this.errors.lastName = "Apellido es requerido.";
      } else if (/\s/.test(this.userAux.lastName)) {
        this.errors.lastName = "El apellido no debe contener espacios.";
      }

      if (!this.userAux.email.trim()) {
        this.errors.email = "Correo es requerido.";
      } else if (!this.validEmail(this.userAux.email)) {
        this.errors.email = "Formato de correo inválido.";
      } else if (/\s/.test(this.userAux.email)) {
        this.errors.email = "El correo no debe contener espacios.";
      }

      if (this.userAux.provincia) {
        if (!this.userAux.ciudad) {
          this.errors.ciudad = "Ciudad es requerido.";
        }
      }

      if (Object.keys(this.errors).length > 0) {
        return; // Hay errores, no continuar
      }

      // Lógica de guardado si todo es válido
      if (!this.userToSave) {
        this.postUser();
      } else {
        this.update_await = true;
        this.updateUser();
      }
    },

    notificarInvestigadores(userSave) {
      const mail = {
        para: userSave.email,
        asunto: "Usuario Creado con exito en Project Task",
        mensaje:
          "Se ha creado un nuevo usuario: " +
          userSave.username +
          "\n" +
          "Por favor, inicia sesión con tu usuario y contraseña. \n el usuario es: " +
          userSave.username +
          "\n y la contraseña es: " +
          userSave.password +
          "\n",
        servicio: "Proyecto_Tareas",
      };
      try {
        sendEmailFachada(mail);
      } catch (error) {
        console.log(error);
      }
    },

    drop() {
      const resultado = confirm(
        "¿Estás seguro de que quieres eliminar el usuario?",
      );
      if (resultado) {
        this.update_await = true;
        this.deleteUser();
        this.update_await = false;
      }
    },

    async postUser() {
      this.userToSave = {
        username: this.userAux.username,
        firstName: this.userAux.firstName,
        lastName: this.userAux.lastName,
        email: this.userAux.email,
        password: this.userAux.username,
        rol: this.role,
        telefono: this.userAux.telefono,
        ciudad: this.userAux.ciudad,
        provincia: this.userAux.provincia,
        ultimoAcceso: this.userAux.ultimoAcceso,
        activo: this.userAux.activo,
      };

      try {
        const result = await crearUsuarioFachada(this.userToSave);
        if (result) {
          if (result === 409) {
            // Usuario ya existe, muestra mensaje o emite estado de error
            this.$emit("saved", false); // o puedes emitir un mensaje personalizado
          } else {
            this.notificarInvestigadores(this.userToSave);
            this.$emit("refresh");
            this.$emit("saved", true);
          }
        }
      } catch (error) {
        console.error("Error al crear el usuario:", error);
        this.$emit("saved", false); // en caso de fallo general
      }
    },

    async updateUser() {
      this.userToSave = {
        id: this.userToSave.id,
        username: this.userAux.username,
        firstName: this.userAux.firstName,
        lastName: this.userAux.lastName,
        email: this.userAux.email,
        rol: this.role,
        telefono: this.userAux.telefono,
        ciudad: this.userAux.ciudad,
        provincia: this.userAux.provincia,
        ultimoAcceso: this.userAux.ultimoAcceso,
        activo: this.userAux.activo,
      };

      try {
        await actualizarUsuarioFachada(this.userToSave);

        // Solo emitir después de actualizar con éxito\
        this.update_await = true;
        this.$emit("refresh");
        this.$emit("saved", true);
      } catch (error) {
        console.error("Error al actualizar el usuario:", error);
        this.$emit("saved", false); // podrías emitir un error si deseas
      }
    },

    async deleteUser() {
      try {
        const projects = await fetchIdsProjResponsableFachada(this.userAux.id);
        if (projects.length > 0) {
          this.mensaje =
            "El usuario no se puede eliminar ya que tiene proyectos asignados";
          return;
        }
      } catch (error) {
        console.error("Error al buscar proyectos el usuario:", error);
      }

      try {
        console.log(this.role);
        let agendados = null;
        if (this.role === "responsable") {
          agendados = fetchEventosCreadosFachada(this.userAux.id);
        }
        if (this.role === "investigador") {
          agendados = fetchEventosAsignadosFachada(this.userAux.id);
        }
        if (agendados.length > 0) {
          this.mensaje =
            "El usuario no se puede eliminar ya que tiene eventos asignados";
          return;
        }
      } catch (error) {}
      try {
        await eliminarUsuarioFachada(this.userAux.id);

        // Solo emitir después de eliminar con éxito
        this.$emit("refresh");
        this.$emit("saved", true);
      } catch (error) {
        console.error("Error al eliminar el usuario:", error);
        this.$emit("saved", false); // podrías emitir un error si deseas
      }
    },

    validEmail(email) {
      const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      return regex.test(email);
    },

    exit() {
      const resultado = confirm("¿Estás seguro de que quieres salir?");
      if (resultado) {
        this.clean();
        this.$emit("saved", true);
      }
    },

    clean() {
      this.userAux = {
        username: "",
        firstName: "",
        lastName: "",
        email: "",
        password: "",
        rol: this.role,
      };
    },
    actualizarCiudades() {
      const provinciaSeleccionada = this.provincias.find(
        (p) => p.nombre === this.userAux.provincia,
      );
      this.ciudadesFiltradas = provinciaSeleccionada
        ? provinciaSeleccionada.ciudades
        : [];

      // Solo limpiar la ciudad si ya no pertenece a la provincia seleccionada
      if (!this.ciudadesFiltradas.includes(this.userAux.ciudad)) {
        this.userAux.ciudad = "";
      }
    },
  },
};
</script>

<style scoped>
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
</style>

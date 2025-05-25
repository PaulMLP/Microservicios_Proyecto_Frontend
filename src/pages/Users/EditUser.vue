<template>
  <card class="card">
    <div class="card-header">
      <button class="exit" @click="exit"><span class="ti-close"></span></button>
    </div>
    <div>
      <form @submit.prevent>
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
} from "@/clients/users.js";
export default {
  props: {
    role: String,
    user: Object,
  },
  data() {
    return {
      userToSave: this.user,
      userAux: this.user || {
        username: null,
        firstName: "",
        lastName: "",
        email: "",
        password: "",
        rol: this.role,
      },
      errors: {},
    };
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

      if (Object.keys(this.errors).length > 0) {
        return; // Hay errores, no continuar
      }

      // Lógica de guardado si todo es válido
      if (!this.userToSave) {
        this.postUser();
      } else {
        console.log(this.userToSave);
        this.updateUser();
      }
    },

    drop() {
      const resultado = confirm(
        "¿Estás seguro de que quieres eliminar el usuario?",
      );
      if (resultado) {
        this.deleteUser();
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
      };

      try {
        const result = await crearUsuarioFachada(this.userToSave);

        if (result) {
          if (result === 409) {
            // Usuario ya existe, muestra mensaje o emite estado de error
            this.$emit("saved", false); // o puedes emitir un mensaje personalizado
          } else {
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
        username: this.userAux.username,
        firstName: this.userAux.firstName,
        lastName: this.userAux.lastName,
        email: this.userAux.email,
        password: this.userAux.password,
        rol: this.role,
      };
      try {
        await actualizarUsuarioFachada(this.userAux);

        // Solo emitir después de actualizar con éxito
        this.$emit("refresh");
        this.$emit("saved", true);
      } catch (error) {
        console.error("Error al actualizar el usuario:", error);
        this.$emit("saved", false); // podrías emitir un error si deseas
      }
    },

    async deleteUser() {
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

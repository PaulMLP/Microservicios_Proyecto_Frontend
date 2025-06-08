<template>
  <card class="card" title="Editar Perfil">
    <div>
      <div v-if="update_await" class="spinner-container">
        <div class="spinner"></div>
      </div>
      <form v-else @submit.prevent>
        <div class="row">
          <div class="col-6">
            <fg-input
              type="text"
              label="Nombre de usuario"
              placeholder="Nombre de usuario"
              :disabled="true"
              v-model="user.username"
            ></fg-input>
          </div>
        </div>
        <div class="row">
          <div class="col-6">
            <fg-input
              type="text"
              label="Nombre"
              placeholder="Nombres"
              v-model="user.firstName"
              :error="errors.firstName"
            ></fg-input>
          </div>
          <div class="col-6">
            <fg-input
              type="text"
              label="Apellido"
              placeholder="Apellidos"
              v-model="user.lastName"
              :error="errors.lastName"
            ></fg-input>
          </div>
        </div>
        <div class="row">
          <div class="col-6">
            <fg-input
              type="email"
              label="Correo"
              placeholder="Email"
              v-model="user.email"
              :error="errors.email"
            ></fg-input>
          </div>
          <div class="col-6">
            <fg-input
              type="text"
              label="Rol"
              :disabled="true"
              placeholder="Rol"
              v-model="user.rol"
            ></fg-input>
          </div>
        </div>
        <div class="row">
          <div class="col-6">
            <label>Provincia</label>
            <select
              class="form-control"
              v-model="user.provincia"
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
              v-model="user.ciudad"
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
              v-model="user.telefono"
              :error="errors.telefono"
            ></fg-input>
          </div>
          <div class="col-6">
            <fg-input
              type="text"
              label="Último Acceso"
              :disabled="true"
              v-model="ultimoAcceso"
            ></fg-input>
          </div>
        </div>
        <div class="text-center">
          <p-button type="info" round @click.native.prevent="updateProfile">
            Actualizar Perfil
          </p-button>
        </div>
        <div class="clearfix"></div>
      </form>
    </div>
  </card>
</template>

<script>
import { actualizarUsuarioFachada } from "@/clients/users.js";
export default {
  data() {
    return {
      userInfo: "",
      userDB: "",
      errors: {},
      ultimoAcceso: "",
      provincias: [],
      ciudadesFiltradas: [],
      update_await: false,
      user: {
        firstName: "",
        lastName: "",
        email: "",
        rol: "",
        telefono: "",
        ciudad: "",
        provincia: "",
        ultimoAcceso: "",
        activo: true,
      },
    };
  },
  async mounted() {
    const response = await fetch("/data/provincias.json");
    this.provincias = await response.json();
    try {
      this.userInfo = this.$store.state.userInfo;
      this.userDB = this.$store.state.userDbData;

      this.user = {
        username: this.userInfo.preferred_username,
        firstName: this.userInfo.given_name,
        lastName: this.userInfo.family_name,
        email: this.userInfo.email,
        rol: this.userDB.rol,
        telefono: this.userDB.telefono || "",
        ciudad: this.userDB.ciudad || "",
        provincia: this.userDB.provincia || "",
        ultimoAcceso: this.userDB.ultimoAcceso || "",
        activo: this.userDB.activo ?? true,
        id: this.userDB.id || null,
      };

      if (this.user.provincia) {
        this.actualizarCiudades();
      }

      this.ultimoAcceso = this.formatearFecha(this.user.ultimoAcceso);
    } catch (error) {
      console.error("Error al montar perfil:", error);
    }
  },
  methods: {
    formatearFecha(isoString) {
      if (!isoString) return "";
      const fecha = new Date(isoString);
      return fecha.toLocaleString(undefined, {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: true,
      });
    },
    validateForm() {
      this.errors = {};

      if (!this.user.firstName) this.errors.firstName = "Nombre requerido";
      if (!this.user.lastName) this.errors.lastName = "Apellido requerido";
      if (!this.user.email || !this.user.email.includes("@"))
        this.errors.email = "Correo inválido";
      if (!this.user.telefono) {
      } else if (!/^\d{7,15}$/.test(this.user.telefono)) {
        this.errors.telefono =
          "Teléfono inválido (solo números, mínimo 7 dígitos)";
      }
      if (this.user.provincia) {
        if (!this.user.ciudad) {
          this.errors.ciudad = "Ciudad es requerido.";
        }
      }

      return Object.keys(this.errors).length === 0;
    },
    async updateProfile() {
      if (!this.validateForm()) {
        alert("Revisa los errores del formulario.");
        return;
      }
      try {
        this.update_await = true;
        await actualizarUsuarioFachada(this.user);
        this.update_await = false;
      } catch (error) {
        console.error("Error al actualizar el usuario:", error);
      }
    },
    actualizarCiudades() {
      const provinciaSeleccionada = this.provincias.find(
        (p) => p.nombre === this.user.provincia,
      );
      this.ciudadesFiltradas = provinciaSeleccionada
        ? provinciaSeleccionada.ciudades
        : [];

      // Solo limpiar la ciudad si ya no pertenece a la provincia seleccionada
      if (!this.ciudadesFiltradas.includes(this.user.ciudad)) {
        this.user.ciudad = "";
      }
    },
  },
};
</script>

<style scoped></style>

<template>
  <card class="card">
    <div class="card-header">
      <button class="exit" @click="exit"><span class="ti-close"></span></button>
    </div>

    <div>
      <form @submit.prevent>
        <div class="row">
          <div class="col-md-8">
            <fg-input
              type="text"
              label="Titulo"
              placeholder="Titulo"
              v-model="projectAux.tiulo"
            >
            </fg-input>
          </div>
          <div class="col-md-4">
            <label for="estado">Estado</label>
            <select
              id="estado"
              v-model="projectAux.estado"
              class="form-control"
            >
              <option value="en_progreso">En progreso</option>
              <option value="finalizado">Finalizado</option>
              <option value="pendiente">Pendiente</option>
            </select>
          </div>
        </div>
        <div class="row">
          <div class="col-md-12">
            <div class="form-group">
              <label>Descripción</label>
              <textarea
                rows="5"
                class="form-control border-input"
                placeholder="Aquí puede estar la descripción"
                v-model="projectAux.descripcion"
              >
              </textarea>
            </div>
          </div>
        </div>

        <div class="row">
          <div class="col-md-6">
            <fg-input
              type="text"
              label="Fecha Inicio"
              placeholder="Fecha Inicio"
              v-model="projectAux.fechaInicio"
            >
            </fg-input>
          </div>
          <div class="col-md-6">
            <fg-input
              type="text"
              label="Fecha Fin"
              placeholder="Fecha Fin"
              v-model="projectAux.fechaFin"
            >
            </fg-input>
          </div>
        </div>
        <div class="row">
          <div class="col-md-6">
            <label for="responsable">Responsable</label>
            <select
              id="responsable"
              v-model="projectAux.responsable"
              class="form-control"
            >
              <option value="en_progreso">En progreso</option>
              <option value="finalizado">Finalizado</option>
              <option value="pendiente">Pendiente</option>
            </select>
          </div>
          <div class="col-md-6">
            <label for="investigadores">Investigadores</label>
            <select
              id="investigadores"
              v-model="projectAux.investigadores"
              class="form-control"
            >
              <option value="en_progreso">En progreso</option>
              <option value="finalizado">Finalizado</option>
              <option value="pendiente">Pendiente</option>
            </select>
          </div>
        </div>

        <div
          class="text-center"
          style="display: flex; justify-content: center; gap: 5px; margin-top: 10px;"
        >
          <p-button type="info" @click.native.prevent="save">
            <span class="ti-save"></span
            ><span style="margin-left: 5px">Guardar</span>
          </p-button>

          <p-button type="danger" @click.native.prevent="save">
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
export default {
  props: {
    project: Object,
  },
  data() {
    return {
      projectAux: this.project || {
        id: null,
        titulo: "",
        descripcion: "",
        estado: "",
        fechaInicio: "",
        fechaFin: "",
        responsable: null,
        usuarioIds: [],
      },
    };
  },
  methods: {
    save() {
      //VALIDAR CAMPOS Y GUARDADO
      this.$emit("saved", true);
    },
    exit() {
      const resultado = confirm("¿Estás seguro de que quieres salir?");

      if (resultado) {
        this.clean();
        this.$emit("saved", true);
      }
    },

    clean() {
      this.projectAux = {
        id: null,
        titulo: "",
        descripcion: "",
        estado: "",
        fechaInicio: "",
        fechaFin: "",
        responsable: null,
        usuarioIds: [],
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

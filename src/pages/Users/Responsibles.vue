<template>
  <div>
    <EditUser
      v-if="edit"
      :user="user"
      :role="'responsable'"
      @saved="saved"
      @refresh="recargarComponente"
    />
    <div v-else>
      <div v-if="users_await" class="spinner-container">
        <div class="spinner"></div>
      </div>
      <div class="row" v-else>
        <div class="col-12">
          <card :title="table.title" :subTitle="table.subTitle">
            <div slot="raw-content" class="table-responsive">
              <data-table
                :tableData="table.data"
                :data="totalData || []"
                :columns="table.columns"
                @add="addResp"
                @open="open"
              >
              </data-table>
            </div>
          </card>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { DataTable } from "@/components";
import EditUser from "./EditUser.vue";
import {
  obtenerTodosUsuariosFachada,
  obtenerUsuarioKeycloakFachada,
} from "@/clients/users.js";

export default {
  components: {
    EditUser,
    DataTable,
  },
  name: "Responsibles",
  data() {
    return {
      users_await: false,
      edit: false,
      save: false,
      user: null,
      totalData: null,
      tableColumns: [
        { label: "Id", key: "id", width: "8%" },
        { label: "Nombre", key: "nombre", width: "15%" },
        { label: "Correo", key: "correo", width: "15%" },
        { label: "Rol", key: "rol", width: "12%" },
        { label: "Provincia", key: "provincia", width: "20%" },
        { label: "Ciudad", key: "ciudad", width: "20%" },
        { label: "Teléfono", key: "telefono", width: "10%" },
      ],
      table: {
        title: "",
        subTitle: "",
        columns: [],
        data: [],
      },
    };
  },
  async mounted() {
    const rawData = await obtenerTodosUsuariosFachada("responsable");
    this.totalData = this.limpiarDatos(rawData);
    this.table = {
      title: "Responsables",
      subTitle: "",
      columns: [...this.tableColumns],
      data: [...this.totalData],
    };
  },
  methods: {
    addResp() {
      this.user = null;
      this.edit = true;
    },
    async open(item) {
      await obtenerUsuarioKeycloakFachada(item.correo).then((response) => {
        this.user = response;
        this.user.id = item.id;
        this.user.rol = "responsable";
      });
      if (this.user) {
        this.edit = true;
      }
    },
    saved(value) {
      this.edit = !value;
    },
    async recargarComponente() {
      this.users_await = true;
      this.totalData = [];
      this.table.data = [];
      console.log("Recargando componente...");

      const rawData = await obtenerTodosUsuariosFachada("responsable");
      this.totalData = this.limpiarDatos(rawData);
      this.table.data = [...this.totalData];
      this.users_await = false;
    },
    limpiarDatos(dataArray) {
      // Reemplaza null o undefined en campos específicos por ""
      return dataArray.map((item) => ({
        ...item,
        provincia: item.provincia || "",
        telefono: item.telefono || "",
        nombre: item.nombre || "",
        ciudad: item.ciudad || "",
        // omitimos activo y ultimoAcceso para no mostrar
      }));
    },
  },
};
</script>

<style>
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

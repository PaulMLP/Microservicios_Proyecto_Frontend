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
        { label: "Id", key: "id", width: "10%" },
        { label: "Nombre", key: "nombre", width: "45%" },
        { label: "Correo", key: "correo", width: "45%" },
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
    this.totalData = await obtenerTodosUsuariosFachada("responsable");
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

      this.totalData = await obtenerTodosUsuariosFachada("responsable");
      this.table.data = [...this.totalData];
      this.users_await = false;
    },
  },
};
</script>
<style></style>

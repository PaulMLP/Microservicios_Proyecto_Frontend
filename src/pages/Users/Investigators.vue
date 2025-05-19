<template>
  <div>
    <EditUser
      v-if="edit"
      :user="user"
      :role="'investigador'"
      @saved="saved"
      @refresh="recargarComponente"
    />
    <div class="row" v-else>
      <div class="col-12">
        <card :title="table.title" :subTitle="table.subTitle">
          <div slot="raw-content" class="table-responsive">
            <data-table
              :tableData="table.data"
              :data="totalData || []"
              :columns="table.columns"
              @add="addInvest"
              @open="open"
            >
            </data-table>
          </div>
        </card>
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
  name: "Investigators",
  data() {
    return {
      edit: false,
      save: false,
      user: null,
      totalData: [],
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
  async created() {
    this.totalData = await obtenerTodosUsuariosFachada("investigador");
    this.table = {
      title: "Investigadores",
      subTitle: "",
      columns: [...this.tableColumns],
      data: [...this.totalData],
    };
  },
  methods: {
    addInvest() {
      this.user = null;
      this.edit = true;
    },
    async open(item) {
      await obtenerUsuarioKeycloakFachada(item.correo).then((response) => {
        this.user = response;
        this.user.id = item.id;
        this.user.rol = "investigador";
      });
      if (this.user) {
        this.edit = true;
      }
    },
    saved(value) {
      this.edit = !value;
    },

    async recargarComponente() {
      this.totalData = [];
      this.table.data = [];
      console.log("Recargando componente...");

      this.totalData = await obtenerTodosUsuariosFachada("investigador");
      this.table.data = [...this.totalData];
    },
  },
};
</script>
<style></style>

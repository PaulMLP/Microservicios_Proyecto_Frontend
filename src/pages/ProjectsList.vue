<template>
  <EditProject
    v-if="edit"
    :project="project"
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
            :add="true"
            @add="addProject"
            @open="open"
          >
          </data-table>
        </div>
      </card>
    </div>
  </div>
</template>
<script>
import { DataTable } from "@/components";
import EditProject from "./Projects/EditProject.vue";
import {
  fetchProyectosFachada,
  fetchProyectoIdFachada,
} from "@/clients/projects.js";
import { cambiarFecha } from "../utils/methods";
export default {
  components: {
    DataTable,
    EditProject,
  },
  data() {
    return {
      edit: false,
      save: false,
      project: null,
      totalData: [],
      tableColumns: [
        { label: "ID", key: "id", width: "5%" },
        { label: "Título", key: "titulo", width: "18%" },
        { label: "Descripción", key: "descripcion", width: "37%" },
        { label: "Estado", key: "estado", width: "15%" },
        { label: "Fecha Inicio", key: "fechaInicio", width: "15%" },
        { label: "Fecha Fin", key: "fechaFin", width: "10%" },
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
    this.totalData = await fetchProyectosFachada();
    this.totalData = this.totalData.map((proyecto) => ({
      ...proyecto,
      fechaInicio: cambiarFecha(proyecto.fechaInicio),
      fechaFin: cambiarFecha(proyecto.fechaFin),
    }));

    this.table = {
      title: "Todos los Proyectos",
      subTitle: "",
      columns: [...this.tableColumns],
      data: [...this.totalData],
    };
  },
  methods: {
    addProject() {
      this.project = null;
      this.edit = true;
    },
    async open(item) {
      alert("Abriendo proyecto: " + item.id);
      await fetchProyectoIdFachada(item.id).then((response) => {
        this.project = response;
      });
      if (this.project) {
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

      this.totalData = await fetchProyectosFachada();
      this.totalData = this.totalData.map((proyecto) => ({
        ...proyecto,
        fechaInicio: cambiarFecha(proyecto.fechaInicio),
        fechaFin: cambiarFecha(proyecto.fechaFin),
      }));

      this.table.data = [...this.totalData];
    },
  },
};
</script>
<style></style>

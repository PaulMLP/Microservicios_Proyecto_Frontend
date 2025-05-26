<template>
  <Project v-if="show" :project="project" @exit="exit" />
  <div v-else class="row">
    <div class="col-12">
      <card :title="table.title" :subTitle="table.subTitle">
        <div slot="raw-content" class="table-responsive">
          <data-table
            :tableData="table.data"
            :data="totalData || []"
            :columns="table.columns"
            @add="add"
            :add="false"
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
import Project from "./Projects/Project.vue";
import {
  fetchMisTareasFachada,
  fetchProyectoIdFachada,
} from "@/clients/projects.js";
import { cambiarFecha, calcularDiasRestantes } from "../utils/methods";
export default {
  components: {
    DataTable,
    Project,
  },
  data() {
    return {
      userDB: this.$store.state.userDbData,
      show: false,
      task: null,
      project: null,
      totalData: [],
      tableColumns: [
        { label: "Descripción", key: "descripcion", width: "30%" },
        { label: "Proyecto", key: "proyectoTitulo", width: "20%" },
        { label: "Estado", key: "estado", width: "10%" },
        { label: "Fecha Inicio", key: "fechaAsignacion", width: "10%" },
        { label: "Fecha Fin", key: "fechaVencimiento", width: "10%" },
        { label: "Tiempo Restante", key: "diasRestantes", width: "20%" },
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
    this.totalData = await fetchMisTareasFachada(this.userDB.id);

    this.totalData = this.totalData.map((tarea) => ({
      ...tarea,
      diasRestantes: calcularDiasRestantes(tarea.fechaVencimiento),
      fechaAsignacion: cambiarFecha(tarea.fechaAsignacion),
      fechaVencimiento: cambiarFecha(tarea.fechaVencimiento),
    }));

    this.table = {
      title: "Todas mis Tareas",
      subTitle: "",
      columns: [...this.tableColumns],
      data: [...this.totalData],
    };
  },
  methods: {
    async open(item) {
      await fetchProyectoIdFachada(item.proyectoId).then((response) => {
        this.project = response;
      });
      if (this.project) {
        this.show = true;
      }
    },
    exit(value) {
      this.show = !value;
    },
    add() {},
  },
};
</script>
<style>
/* 6gD:AE6?3U44

Project Task
projectasknotification@gmail.com

zaer vzqg btgb nnmo
*/
</style>

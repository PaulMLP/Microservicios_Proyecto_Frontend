<template>
  <Project v-if="show" :project="project" @exit="exit" />
  <div class="row" v-else>
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
  fetchProyectosUsuarioFachada,
  fetchProyectoIdFachada,
} from "@/clients/projects.js";
import { cambiarFecha } from "../utils/methods";
export default {
  components: {
    DataTable,
    Project,
  },
  computed: {
    routeName() {
      const { name } = this.$route;
      return this.capitalizeFirstLetter(name);
    },
  },
  data() {
    return {
      userDB: this.$store.state.userDbData,
      token: this.$store.state.token,
      show: false,
      project: null,
      totalData: [],
      tableColumns: [
        { label: "ID", key: "id", width: "5%" },
        { label: "Título", key: "titulo", width: "20%" },
        { label: "Descripción", key: "descripcion", width: "35%" },
        { label: "Estado", key: "estado", width: "10%" },
        { label: "Fecha Inicio", key: "fechaInicio", width: "10%" },
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
    this.totalData = await fetchProyectosUsuarioFachada(this.userDB.id);

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
    async open(item) {
      await fetchProyectoIdFachada(item.id).then((response) => {
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
<style></style>

<template>
  <EditProject v-if="edit" :project="project" @saved="saved" />
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
        { label: "Descripción", key: "descripcion", width: "33%" },
        { label: "Estado", key: "estado", width: "10%" },
        { label: "Fecha Inicio", key: "fechaInicio", width: "10%" },
        { label: "Fecha Fin", key: "fechaFin", width: "10%" },
        { label: "Responsable", key: "responsable", width: "14%" },
      ],
      table: {
        title: "",
        subTitle: "",
        columns: [],
        data: [],
      },
    };
  },
  mounted() {
    this.totalData = [
      {
        id: 1,
        titulo: "Sistema de Gestión de Proyectos de Tesis",
        descripcion:
          "Aplicación para organizar y supervisar proyectos de tesis de estudiantes universitarios.",
        estado: "progreso",
        fechaInicio: "2025-03-15",
        fechaFin: "2025-11-30",
        responsable: 1,
      },
      {
        id: 2,
        titulo: "Plataforma de Publicaciones Académicas",
        descripcion:
          "Sistema para gestionar la revisión, publicación y difusión de artículos académicos.",
        estado: "pendiente",
        fechaInicio: "2025-07-01",
        fechaFin: "2026-01-15",
        responsable: 2,
      },
      {
        id: 3,
        titulo: "Observatorio de Innovación Tecnológica",
        descripcion:
          "Herramienta para monitorear y documentar avances tecnológicos en áreas estratégicas.",
        estado: "completado",
        fechaInicio: "2024-09-01",
        fechaFin: "2025-04-30",
        responsable: 3,
      },
      {
        id: 4,
        titulo: "Red Colaborativa de Investigadores",
        descripcion:
          "Plataforma que facilita la colaboración entre investigadores de distintas instituciones.",
        estado: "progreso",
        fechaInicio: "2025-01-10",
        fechaFin: "2025-12-10",
        responsable: 1,
      },
      {
        id: 5,
        titulo: "Repositorio de Datos Científicos",
        descripcion:
          "Sistema para almacenar, consultar y compartir conjuntos de datos científicos.",
        estado: "pendiente",
        fechaInicio: "2025-08-01",
        fechaFin: "2026-03-31",
        responsable: 2,
      },
    ];

    this.table = {
      title: "Todos los Proyectos",
      subTitle: "",
      columns: [...this.tableColumns],
      data: [...this.totalData],
    };
  },
  methods: {
    addProject() {
      this.edit = true;
    },
    open(item) {
      this.user = item;
      alert("Your data: " + JSON.stringify(this.user));
      if (this.user) {
        this.edit = true;
      }
    },
    saved(value) {
      this.edit = !value;
    },
  },
};
</script>
<style></style>

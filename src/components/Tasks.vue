<template>
  <div class="tasks">
    <h6 class="text-sm text-gray-600">
      Arrastra las tareas entre columnas para cambiar su estado.
    </h6>

    <div class="row gap-0">
      <KanbanColumn
        class="col-4"
        v-for="estado in estados"
        :key="estado"
        :estado="estado"
        :tareas="tareasPorEstado(estado)"
        @mover-tarea="moverTarea"
      />
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import KanbanColumn from "./Board/KanbanColumn.vue";

const estados = ["Por hacer", "En progreso", "Completado"];

const tareas = ref([
  {
    id: 1,
    nombre: "Tarea 1",
    descripcion: "Descripción de la tarea 1",
    estado: "Por hacer",
  },
  {
    id: 4,
    nombre: "Tarea 4",
    descripcion: "Descripción de la tarea 4",
    estado: "Por hacer",
  },
  {
    id: 2,
    nombre: "Tarea 2",
    descripcion: "Descripción de la tarea 2",
    estado: "En progreso",
  },
  {
    id: 3,
    nombre: "Tarea 3",
    descripcion: "Descripción de la tarea 3",
    estado: "Completado",
  },
]);

const tareasPorEstado = (estado) =>
  tareas.value.filter((t) => t.estado === estado);

const moverTarea = ({ tareaId, nuevoEstado }) => {
  const tarea = tareas.value.find((t) => t.id === tareaId);
  if (tarea) {
    tarea.estado = nuevoEstado;
  }
};
</script>
<style scoped>
.tasks {
  border-top: solid 3px #dee2e6;
  padding-top: 1rem;
}
</style>

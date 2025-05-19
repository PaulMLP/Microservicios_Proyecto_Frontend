<template>
  <div class="board-column" @dragover.prevent @drop="handleDrop">
    <h5 class="board-header">{{ estado }}</h5>
    <div class="board-content">
      <div
        v-for="tarea in tareas"
        :key="tarea.id"
        draggable="true"
        @dragstart="handleDragStart(tarea.id)"
        class="task"
      >
        {{ tarea.nombre }}
      </div>
    </div>
  </div>
</template>

<script setup>
import { defineProps, defineEmits } from "vue";

const props = defineProps({
  estado: String,
  tareas: Array,
});

const emit = defineEmits(["mover-tarea"]);

const handleDragStart = (tareaId) => {
  event.dataTransfer.setData("tarea-id", tareaId);
};

const handleDrop = (event) => {
  const tareaId = parseInt(event.dataTransfer.getData("tarea-id"));
  emit("mover-tarea", { tareaId, nuevoEstado: props.estado });
};
</script>
<style scoped>
.board-column {
  display: flex;
  flex-direction: column;
  padding: 0px;
  border: solid 1px #dee2e6;
  border-radius: 4px;
  background-color: #f5dfbb;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  overflow: hidden;
}

.board-header {
  background-color: #0e9594;
  color: white;
  padding: 0.3rem;
  margin: 0;
}

.board-content {
  display: flex;
  flex-direction: column;
  gap: 0.2rem;
  min-height: 200px;
  margin: 0px;
  padding: 0.4rem;
}
.task {
  background-color: #fff;
  padding: 10px;
  margin-bottom: 0px 10px;
  border-radius: 4px;
  cursor: grab;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}
</style>

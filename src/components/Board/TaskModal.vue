<template>
  <div
    class="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50"
  >
    <div class="bg-white p-6 rounded shadow max-w-md w-full">
      <h2 class="text-2xl mb-4">{{ tarea.titulo }}</h2>
      <p class="mb-4 whitespace-pre-wrap">{{ tarea.descripcion }}</p>
      <button
        @click="$emit('cerrar')"
        class="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
      >
        Cerrar
      </button>
    </div>
  </div>
</template>

<script setup>
defineProps(["tarea"]);
defineEmits(["cerrar"]);
</script>

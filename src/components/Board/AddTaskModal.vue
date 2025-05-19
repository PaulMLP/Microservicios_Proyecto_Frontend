<template>
  <div class="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
    <div class="bg-white p-6 rounded shadow max-w-md w-full">
      <h2 class="text-2xl mb-4">Agregar Tarea</h2>
      <input v-model="titulo" placeholder="Título" class="w-full border mb-2 p-2 rounded" />
      <textarea v-model="descripcion" placeholder="Descripción" class="w-full border mb-4 p-2 rounded"></textarea>
      <div class="flex justify-end space-x-2">
        <button @click="$emit('cerrar')" class="bg-gray-400 text-white px-4 py-2 rounded">Cancelar</button>
        <button @click="guardar" class="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700">Guardar</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
const emit = defineEmits(['guardar', 'cerrar'])
const titulo = ref('')
const descripcion = ref('')

function guardar() {
  if (!titulo.value.trim()) return
  emit('guardar', {
    titulo: titulo.value,
    descripcion: descripcion.value,
    estado: 'Por hacer'
  })
  titulo.value = ''
  descripcion.value = ''
}
</script>

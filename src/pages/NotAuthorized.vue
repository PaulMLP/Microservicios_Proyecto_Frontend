<template>
  <div class="not-authorized-container">
    <div class="content">
      <h1>🚫 Acceso no autorizado</h1>
      <p>No tienes permisos para ver esta página.</p>
      <router-link to="/">Volver al inicio</router-link>
    </div>
  </div>
</template>

<script>
export default {
  name: "NotAuthorized",
};
</script>

<style scoped>
.not-authorized-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background-color: #f5f5f5;
}
.content {
  text-align: center;
  padding: 2rem;
  background: white;
  border-radius: 8px;
  box-shadow: 0px 4px 12px rgba(0, 0, 0, 0.1);
}
h1 {
  color: #e74c3c;
  margin-bottom: 1rem;
}
a {
  color: #3498db;
  text-decoration: none;
  font-weight: bold;
}
</style>

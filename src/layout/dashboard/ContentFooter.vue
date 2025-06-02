<template>
  <footer class="footer">
    <div class="container-fluid d-flex flex-wrap justify-content-between">
      <nav>
        <ul>
          <li v-if="$store.state.rol === 'admin'">
            <router-link :to="{ path: '/dashboard' }">Dashboard</router-link>
          </li>
        </ul>
      </nav>
      <div class="copyright d-flex flex-wrap">
        &copy;Codificado por
        <a href="https://github.com/ErickSebas18" target="_blank">
          &nbsp; Erick Chavez</a
        >
        &nbsp;y
        <a href="https://github.com/PaulMLP" target="_blank">
          &nbsp;Paul Merizalde</a
        >&nbsp; Diseñado por
        <a href="https://www.creative-tim.com/?ref=pdf-vuejs" target="_blank"
          >&nbsp; Creative Tim.</a
        >
      </div>
    </div>
  </footer>
</template>
<script>
export default {};
</script>
<style></style>

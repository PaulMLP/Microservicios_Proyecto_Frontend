<template>
  <div class="wrapper">
    <side-bar>
      <template slot="links">
        <sidebar-link
          v-if="this.$store.state.rol === 'admin'"
          to="/dashboard"
          name="Dashboard"
          icon="ti-panel"
        />
        <sidebar-link to="/stats" name="Perfil de Usuario" icon="ti-user" />
        <sidebar-link
          v-if="this.$store.state.rol === 'admin'"
          to="/users-list"
          name="Usuarios"
          icon="ti-view-list-alt"
        />
        <sidebar-link
          v-if="this.$store.state.rol === 'admin'"
          to="/projects"
          name="Proyectos"
          icon="ti-briefcase"
        />
        <sidebar-link
          v-if="this.$store.state.rol !== 'admin'"
          to="/my-projects"
          name="Mis Proyectos"
          icon="ti-briefcase"
        />
        <sidebar-link
          v-if="this.$store.state.rol !== 'admin'"
          to="/my-tasks"
          name="Mis Tareas"
          icon="ti-file"
        />
        <sidebar-link to="/typography" name="Typography" icon="ti-text" />
        <sidebar-link to="/icons" name="Icons" icon="ti-pencil-alt2" />
        <sidebar-link to="/notifications" name="Notifications" icon="ti-bell" />
      </template>
      <mobile-menu>
        <li class="nav-item">
          <a class="nav-link">
            <i class="ti-panel"></i>
            <p>Stats</p>
          </a>
        </li>
        <li class="nav-item">
          <a class="nav-link">
            <i class="ti-settings"></i>
            <p>Settings</p>
          </a>
        </li>
        <li class="divider"></li>
      </mobile-menu>
    </side-bar>
    <div class="main-panel">
      <top-navbar></top-navbar>

      <dashboard-content @click.native="toggleSidebar"> </dashboard-content>

      <content-footer></content-footer>
    </div>
  </div>
</template>
<style lang="scss"></style>
<script>
import TopNavbar from "./TopNavbar.vue";
import ContentFooter from "./ContentFooter.vue";
import DashboardContent from "./Content.vue";
import MobileMenu from "./MobileMenu";
export default {
  components: {
    TopNavbar,
    ContentFooter,
    DashboardContent,
    MobileMenu,
  },
  methods: {
    toggleSidebar() {
      if (this.$sidebar.showSidebar) {
        this.$sidebar.displaySidebar(false);
      }
    },
  },
};
</script>

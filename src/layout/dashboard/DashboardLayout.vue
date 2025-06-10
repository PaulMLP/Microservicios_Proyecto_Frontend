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
        <sidebar-link
          v-if="this.$store.state.rol !== 'admin'"
          to="/my-agenda"
          name="Mi Agenda"
          icon="ti-agenda"
        />
        <sidebar-link
          v-if="this.$store.state.rol !== 'admin'"
          to="/userprofile"
          name="Perfil de Usuario"
          icon="ti-user"
        />
      </template>
      <mobile-menu>
        <drop-down
          class="nav-item"
          :title="nickname"
          title-classes="nav-link"
          icon="ti-user"
        >
          <div>
            <div class="info">
              <p>{{ name }}</p>
              <p>{{ email }}</p>
              <p>{{ role }}</p>
            </div>
            <button class="dropdown-item" @click="logout">
              <i class="ti-shift-left"></i>Salir
            </button>
          </div>
        </drop-down>
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
import store from "@/store";
import axios from "axios";
import keycloak from "@/plugins/keycloak";
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
  data() {
    return {
      nickname: this.$store.state.userInfo.preferred_username,
      name: this.$store.state.userInfo.given_name,
      email: this.$store.state.userInfo.email,
      role: "",
      userDB: null,
    };
  },
  mounted() {
    try {
      this.role = this.$store.state.rol;
      this.userDB = this.$store.state.userDbData;
    } catch (error) {}
  },

  methods: {
    toggleSidebar() {
      if (this.$sidebar.showSidebar) {
        this.$sidebar.displaySidebar(false);
      }
    },
    async logout() {
      this.$store.commit("setUserInfo", null);
      this.$store.commit("setUserDbData", null);
      const API_URL = process.env.VUE_APP_USUARIOS_API_URL;
      if (this.role != "admin") {
        const urlActivo = `${API_URL}/${this.userDB.id}/activo`;
        await axios.put(urlActivo, JSON.stringify(false), {
          headers: {
            Authorization: `Bearer ${store.getters.getToken}`,
            "Content-Type": "application/json",
          },
        });
      }
      keycloak.logout();
    },
  },
};
</script>
<style scoped>
.info {
  display: flex;
  flex-direction: column;
  padding: 3px 10px;
  cursor: default;

  p {
    margin: 0px;
    color: gray;
  }
}
</style>

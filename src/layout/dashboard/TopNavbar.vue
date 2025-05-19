<template>
  <nav class="navbar navbar-expand-lg navbar-light">
    <div class="container-fluid">
      <a class="navbar-brand" :href="'#/' + $route.path.replace(/^\/+/, '')">
        {{ routeName }}
      </a>
      <span>{{ userDB }}</span>
      <button
        class="navbar-toggler navbar-burger"
        type="button"
        @click="toggleSidebar"
        :aria-expanded="$sidebar.showSidebar"
        aria-label="Toggle navigation"
      >
        <span class="navbar-toggler-bar"></span>
        <span class="navbar-toggler-bar"></span>
        <span class="navbar-toggler-bar"></span>
      </button>
      <div class="collapse navbar-collapse">
        <ul class="navbar-nav ml-auto">
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
              </div>
              <button class="dropdown-item" @click="logout">
                <i class="ti-shift-left"></i>Salir
              </button>
            </div>
          </drop-down>
        </ul>
      </div>
      <div style="width: 70px"></div>
    </div>
  </nav>
</template>
<script>
import keycloak from "@/plugins/keycloak";
export default {
  computed: {
    routeName() {
      const { name } = this.$route;
      return this.capitalizeFirstLetter(name);
    },
  },
  data() {
    return {
      activeNotifications: false,
      nickname: this.$store.state.userInfo.preferred_username,
      name: this.$store.state.userInfo.given_name,
      email: this.$store.state.userInfo.email,
      userDB: this.$store.state.userDbData,
    };
  },
  methods: {
    capitalizeFirstLetter(string) {
      return string.charAt(0).toUpperCase() + string.slice(1);
    },
    toggleNotificationDropDown() {
      this.activeNotifications = !this.activeNotifications;
    },
    closeDropDown() {
      this.activeNotifications = false;
    },
    toggleSidebar() {
      this.$sidebar.displaySidebar(!this.$sidebar.showSidebar);
    },
    hideSidebar() {
      this.$sidebar.displaySidebar(false);
    },
    logout() {
      keycloak.logout();
    },
    adjustDropdownPosition(event) {
      const dropdown = event.target.querySelector(".dropdown-menu");
      if (!dropdown) return;

      const rect = dropdown.getBoundingClientRect();
      if (rect.right > window.innerWidth) {
        dropdown.classList.add("dropdown-menu-right");
      } else {
        dropdown.classList.remove("dropdown-menu-right");
      }
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

#menu {
  right: 0 !important;
  left: auto !important;
  border: solid 1px #9d1c1c;
}
</style>

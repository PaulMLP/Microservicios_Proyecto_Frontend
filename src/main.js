import Vue from "vue";
import App from "./App";
import router from "./router";
import store from "./store";
import { initKeycloak } from "./plugins/keycloak";
import PaperDashboard from "./plugins/paperDashboard";
import "vue-notifyjs/themes/default.css";

Vue.use(PaperDashboard);

initKeycloak().then(() => {
  new Vue({
    router,
    store,
    render: (h) => h(App),
  }).$mount("#app");
});

import Vue from "vue";
import VueRouter from "vue-router";
import routes from "./routes";
import store from "@/store"; // importa tu store para obtener el rol

Vue.use(VueRouter);

const router = new VueRouter({
  routes,
  linkActiveClass: "active",
});

router.beforeEach((to, from, next) => {
  const allowedRoles = to.meta.allowedRoles;
  const userRole = store.state.rol;

  if (!allowedRoles) {
    // Ruta sin restricción, dejar pasar
    next();
  } else if (allowedRoles.includes(userRole)) {
    // Rol permitido, permitir acceso
    next();
  } else {
    // No permitido, redirigir o bloquear
    next("/dashboard"); // por ejemplo, redirige al dashboard
  }
});

export default router;

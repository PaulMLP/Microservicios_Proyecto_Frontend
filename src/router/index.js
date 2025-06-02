import Vue from "vue";
import VueRouter from "vue-router";
import routes from "./routes";
import store from "@/store"; // se usa para obtener el rol

Vue.use(VueRouter);

const router = new VueRouter({
  routes,
  linkActiveClass: "active",
});

// router.js
router.beforeEach((to, from, next) => {
  let userRole = store.state.rol;

  // 🔁 Cargar desde localStorage si el store aún no tiene el rol (tras recargar)
  if (!userRole) {
    const storedRol = localStorage.getItem("rol");
    if (storedRol) {
      userRole = storedRol;
      store.commit("setRol", storedRol);
    }
  }

  const allowedRoles = to.meta.allowedRoles;

  if (!allowedRoles || allowedRoles.includes(userRole)) {
    return next(); // ✅ Permitir acceso a la ruta solicitada
  }

  // 🚫 Si no tiene permiso
  return next("/not-authorized");
});

export default router;

import Keycloak from "keycloak-js";
import store from "@/store";
import axios from "axios";
import router from "@/router";

console.log(process.env.VUE_APP_KEYCLOAK_URL);

const keycloak = new Keycloak({
  url: process.env.VUE_APP_KEYCLOAK_URL,
  realm: process.env.VUE_APP_KEYCLOAK_REALM,
  clientId: process.env.VUE_APP_KEYCLOAK_CLIENT_ID,
});

const API_URL = process.env.VUE_APP_USUARIOS_API_URL;

export const initKeycloak = () => {
  return new Promise((resolve, reject) => {
    keycloak
      .init({ onLoad: "login-required", checkLoginIframe: false })
      .then(async (authenticated) => {
        if (!authenticated) {
          keycloak.login();
          reject("No autenticado, redirigiendo a login...");
        } else {
          try {
            // Cargar info básica del usuario
            const userInfo = await keycloak.loadUserInfo();
            const resourceAccess = keycloak.tokenParsed?.resource_access || {};
            const clientName = Object.keys(resourceAccess)[0]; // primer cliente
            const clientRoles = resourceAccess[clientName]?.roles || [];
            let rol = clientRoles[0];
            rol = rol.endsWith("_client") ? rol.replace("_client", "") : rol;

            store.commit("setUserRol", rol);

            if (rol === "admin") {
              router.push("/dashboard");
            } else if (rol === "responsable" || rol === "investigador") {
              // Llamar a backend para obtener datos extendidos del usuario
              const email = userInfo.email;
              const token = keycloak.token;

              const url = `${API_URL}/db/by-mail/${email}`;
              const headers = { Authorization: `Bearer ${token}` };

              let response = await axios.get(url, { headers });

              const urlLastTime = `${API_URL}/${response.data.id}/ultimo-acceso`;
              await axios.put(urlLastTime, {}, { headers });

              const urlActivo = `${API_URL}/${response.data.id}/activo`;
              const res = await axios.put(urlActivo, JSON.stringify(true), {
                headers: {
                  Authorization: `Bearer ${token}`,
                  "Content-Type": "application/json",
                },
              });
              console.log(res.data);

              response = await axios.get(url, { headers });
              store.commit("setUserDbData", response.data);

              router.push("/my-projects");
            } else {
              // si hay otro rol inesperado
              router.push("/not-authorized");
            }

            store.commit("setUserInfo", userInfo);
            store.commit("setToken", keycloak.token);

            // Renovar token periódicamente
            setInterval(() => {
              keycloak
                .updateToken(60)
                .then((refrescado) => {
                  if (refrescado) {
                    console.log("Token renovado");
                    store.commit("setToken", keycloak.token);
                  }
                })
                .catch(() => {
                  console.warn(
                    "No se pudo renovar el token. Cerrando sesión...",
                  );
                  keycloak.logout();
                });
            }, 60000); // cada 60s

            resolve(keycloak);
          } catch (err) {
            console.error("Error al obtener datos del usuario:", err);
            reject(err);
          }
        }
      })
      .catch((err) => {
        console.error("Authentication failed:", err);
        reject(err);
      });
  });
};

export default keycloak;

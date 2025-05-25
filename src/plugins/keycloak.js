import Keycloak from "keycloak-js";
import store from "@/store";
import axios from "axios";

const keycloak = new Keycloak({
  url: "http://localhost:8080",
  realm: "spring-boot-realm",
  clientId: "spring-client-api-rest",
});

const API_URL = "http://localhost:7070/app-usuarios/usuarios";

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

            store.commit("setUserInfo", userInfo);
            store.commit("setToken", keycloak.token);

            // Llamar a backend para obtener datos extendidos del usuario
            const email = userInfo.email;
            const token = keycloak.token;

            const url = `${API_URL}/db/by-mail/${email}`;
            const headers = { Authorization: `Bearer ${token}` };

            const response = await axios.get(url, { headers });
            store.commit("setUserDbData", response.data);

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

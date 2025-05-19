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
  return keycloak
    .init({ onLoad: "login-required", checkLoginIframe: false })
    .then(async (authenticated) => {
      if (!authenticated) {
        keycloak.login();
      } else {
        const userInfo = await keycloak.loadUserInfo();
        store.commit("setUserInfo", userInfo);
        store.commit("setToken", keycloak.token);

        // Ahora llamamos a tu backend para obtener la info completa del usuario y guardarla en store
        try {
          const email = userInfo.email;
          const token = keycloak.token;

          const url = `${API_URL}/db/by-mail/${email}`;
          const headers = { Authorization: `Bearer ${token}` };

          const response = await axios.get(url, { headers });
          // Guardamos la info que nos devuelve el backend
          store.commit("setUserDbData", response.data);
        } catch (error) {
          console.error("Error al obtener usuario desde backend:", error);
        }

        // Opcional: renovar token periódicamente
        keycloak.updateToken(5).catch(() => {
          keycloak.logout();
        });

        return keycloak;
      }
    })
    .catch((error) => {
      console.error("Authentication Failed", error);
    });
};

export default keycloak;

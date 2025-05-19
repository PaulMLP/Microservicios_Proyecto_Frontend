import Vue from "vue";
import Vuex from "vuex";

Vue.use(Vuex);
export default new Vuex.Store({
  state: {
    userInfo: null,
    token: null,
    userDbData: null, // <--- nuevo dato
  },
  mutations: {
    setUserInfo(state, userInfo) {
      state.userInfo = userInfo;
    },
    setToken(state, token) {
      state.token = token;
    },
    setUserDbData(state, userDbData) {
      state.userDbData = userDbData;
    },
  },
  getters: {
    getUserDbData: (state) => state.userDbData,
    getToken: (state) => state.token,
  },
});

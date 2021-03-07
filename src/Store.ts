import Vue from "vue";
import Vuex from "vuex";

Vue.use(Vuex);

export interface LoggedUser {
  isLogged: boolean;
  isMasterAdminLogged: boolean;
}

export const store = new Vuex.Store({
  state: {
    isLogged: false,
    isMasterAdminLogged: false
  },
  mutations: {
    setLoggedUser(state, loggedUser: LoggedUser) {
      state.isLogged = loggedUser.isLogged;
      state.isMasterAdminLogged = loggedUser.isMasterAdminLogged;
    }
  }
});

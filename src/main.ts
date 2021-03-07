import Vue from "vue";
import App from "./App.vue";
import vuetify from "./plugins/vuetify";
import VueCookies from "vue-cookies";
import { router } from "./Router";
import { store } from "./Store";
import { i18n } from "./I18n";
import { Services } from "@/services/Services";
import "reflect-metadata";
import "@/styles/style.scss";

Vue.use(VueCookies);

Vue.config.productionTip = false;

new Vue({
  vuetify,
  router,
  store,
  i18n,
  render: h => h(App)
}).$mount("#app");

Services.authService.setStore(store);

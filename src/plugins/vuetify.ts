import Vue from "vue";
import Vuetify from "vuetify/lib";
import { i18n } from "@/I18n";

Vue.use(Vuetify);

const defaultLang = new Vuetify().framework.lang;

export default new Vuetify({
  lang: {
    t: (key, ...params) =>
      i18n.te(key)
        ? i18n.t(key, params).toString()
        : defaultLang.t(key, ...params)
  }
});

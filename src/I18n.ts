import Vue from "vue";
import VueI18n from "vue-i18n";
import { en } from "@/i18n/en";
import { pl } from "@/i18n/pl";

Vue.use(VueI18n);

export const i18n = new VueI18n({
  locale: "en",
  messages: {
    en,
    pl
  }
});

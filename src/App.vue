<template>
  <v-app>
    <v-navigation-drawer app permanent>
      <navigation-drawer :key="$i18n.locale"></navigation-drawer>
    </v-navigation-drawer>
    <v-main>
      <router-view :key="$i18n.locale"></router-view>
    </v-main>
  </v-app>
</template>

<script lang="ts">
import Vue from "vue";
import { Component } from "vue-property-decorator";
import NavigationDrawer from "@/components/NavigationDrawer.vue";

@Component({
  components: {
    NavigationDrawer
  }
})
export default class App extends Vue {
  created() {
    const language = Vue.$cookies.get("language");

    if (language === "pl" || language === "en") {
      this.$i18n.locale = language;
    }
  }
}
</script>

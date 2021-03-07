<template>
  <v-navigation-drawer absolute dark permanent>
    <v-list dense nav class="py-0">
      <v-list-item two-line>
        <v-list-item-avatar>
          <img :src="constants.logo" />
        </v-list-item-avatar>

        <v-list-item-content>
          <v-list-item-title>{{ $t("title") }}</v-list-item-title>
        </v-list-item-content>
      </v-list-item>

      <v-divider></v-divider>

      <v-list-item-group mandatory v-model="selectedPage">
        <v-list-item
          v-for="page in visiblePages"
          :key="page.title"
          :value="page.title"
          link
          @click="onSelectedPageChange(page)"
        >
          <v-list-item-icon>
            <v-icon>{{ page.icon }}</v-icon>
          </v-list-item-icon>

          <v-list-item-content>
            <v-list-item-title>{{ page.title }}</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-list-item-group>
    </v-list>

    <template v-slot:append>
      <div class="text-center mb-3">
        <v-list-item-avatar class="clickable">
          <img :src="constants.language.pl" @click="setLanguage('pl')" />
        </v-list-item-avatar>
        <v-list-item-avatar class="clickable">
          <img :src="constants.language.en" @click="setLanguage('en')" />
        </v-list-item-avatar>
      </div>
    </template>
  </v-navigation-drawer>
</template>

<script lang="ts">
import Vue from "vue";
import { Component, Watch } from "vue-property-decorator";
import { Route } from "vue-router";
import { Services } from "@/services/Services";
import { Page } from "@/models/Page";

@Component
export default class NavigationDrawer extends Vue {
  readonly constants = {
    logo: require("@/assets/vuetify-logo-dark.webp"),
    language: {
      pl: require("@/assets/pl.png"),
      en: require("@/assets/en.png")
    }
  };

  readonly pages: Page[] = [
    {
      title: this.$t("navigationDrawer.categories").toString(),
      icon: "mdi-view-dashboard",
      sourcePage: "CategoryList",
      isVisible: () => this.$store.state.isLogged
    },
    {
      title: this.$t("navigationDrawer.users").toString(),
      icon: "mdi-account",
      sourcePage: "UserList",
      isVisible: () => this.$store.state.isLogged
    },
    {
      title: this.$t("navigationDrawer.login").toString(),
      icon: "mdi-account",
      sourcePage: "Login",
      isVisible: () => !this.$store.state.isLogged
    },
    {
      title: this.$t("navigationDrawer.logout").toString(),
      icon: "mdi-logout",
      isVisible: () => this.$store.state.isLogged,
      action: () => {
        Services.authService.setLoggedUser(null);

        const page = this.visiblePages[0];

        if (page.sourcePage !== undefined) {
          this.replacePage(page.sourcePage);
        }
      }
    }
  ];

  selectedPage: string | null = null;

  private updateSelectedPageIndicator(routeName: string | null | undefined) {
    const activePage = this.visiblePages.find(
      page => page.sourcePage === routeName
    );

    if (activePage !== undefined) {
      this.selectedPage = activePage.title;
    }
  }

  private replacePage(sourcePage: string) {
    if (this.$router.currentRoute.name !== sourcePage) {
      this.$router.replace({
        name: sourcePage
      });
    }
  }

  mounted() {
    this.updateSelectedPageIndicator(this.$router.currentRoute.name);
  }

  @Watch("$route")
  onRouteChange(to: Route) {
    this.updateSelectedPageIndicator(to.name);
  }

  onSelectedPageChange(page: Page) {
    if (page.sourcePage) {
      this.replacePage(page.sourcePage);
    } else if (page.action !== undefined) {
      page.action();
    }
  }

  setLanguage(language: string) {
    this.$i18n.locale = language;

    Vue.$cookies.set("language", language);
  }

  get visiblePages() {
    return this.pages.filter(item => {
      return !item.isVisible || item.isVisible();
    });
  }
}
</script>

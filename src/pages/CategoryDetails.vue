<template>
  <div>
    <v-toolbar>
      <v-toolbar-title>
        <span @click="onCategoriesClick" class="clickable">{{
          $t("categoryList.title")
        }}</span>
        <span class="ml-2 mr-2">></span>
        <span v-if="category !== null">{{ category.name }}</span>
      </v-toolbar-title>
      <v-spacer></v-spacer>
      <v-tooltip v-if="selectedTab === 1" bottom>
        <template v-slot:activator="{ on, attrs }">
          <v-btn
            v-bind="attrs"
            v-on="on"
            color="secondary"
            @click="onCreateClick"
            ><v-icon dark>mdi-plus</v-icon></v-btn
          >
        </template>
        <span>{{ $t("buttons.create") }}</span>
      </v-tooltip>
    </v-toolbar>

    <v-tabs class="mt-2" v-model="selectedTab" grow>
      <v-tab>{{ $t("categoryDetails.properties.title") }}</v-tab>
      <v-tab>{{ $t("categoryDetails.items.title") }}</v-tab>
      <v-tab>{{ $t("categoryDetails.calendar.title") }}</v-tab>
    </v-tabs>

    <v-tabs-items v-model="selectedTab" v-if="category !== null">
      <v-tab-item>
        <category-properties
          v-model="category"
          @refresh="onRefresh"
        ></category-properties>
      </v-tab-item>
      <v-tab-item>
        <category-items
          ref="categoryItems"
          v-model="category"
          @refresh="onRefresh"
        ></category-items>
      </v-tab-item>
      <v-tab-item>
        <category-calendar
          v-model="category"
          @refresh="onRefresh"
        ></category-calendar>
      </v-tab-item>
    </v-tabs-items>

    <loading-indicator :value="isLoading"></loading-indicator>
    <snackbar ref="snackbar"></snackbar>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import { Component, Ref, Watch } from "vue-property-decorator";
import { plainToClass } from "class-transformer";

import { HttpResponseHandler } from "@/utils/HttpResponseHandler";

import { Services } from "@/services/Services";
import { Category } from "@/models/data/Category";

import LoadingIndicator from "@/components/LoadingIndicator.vue";
import Snackbar from "@/components/Snackbar.vue";
import CategoryProperties from "@/components/CategoryProperties.vue";
import CategoryItems from "@/components/CategoryItems.vue";
import CategoryCalendar from "@/components/CategoryCalendar.vue";

@Component({
  components: {
    LoadingIndicator,
    Snackbar,
    CategoryProperties,
    CategoryItems,
    CategoryCalendar
  }
})
export default class CategoryDetails extends Vue {
  @Ref("snackbar")
  private readonly snackbar!: Snackbar;

  @Ref("categoryItems")
  private readonly categoryItems!: CategoryItems;

  private readonly httpResponseHandler = new HttpResponseHandler();

  category: Category | null = null;

  selectedTab = 0;

  isLoading = false;

  private async refresh() {
    this.isLoading = true;

    const id = this.$route.params["id"];

    const category = await this.httpResponseHandler.handle<Category>(
      Services.httpService.get(`${this.endpoint}/category/${id}`)
    );

    if (category !== null) {
      this.category = plainToClass(Category, category);
      this.category.createItemsAttributes();
    }

    this.isLoading = false;
  }

  private get endpoint() {
    if (Services.authService.isLogged) {
      return "/api/admin";
    }

    return null;
  }

  mounted() {
    this.httpResponseHandler.init(this, this.snackbar);

    if (this.endpoint === null) {
      this.$router.replace({
        name: "Login"
      });

      return;
    }

    const selectedTab = parseInt(this.$route.params["tab"]);

    if (selectedTab >= 0 && selectedTab < 3) {
      this.selectedTab = selectedTab;
    } else {
      this.selectedTab = 0;
    }

    this.refresh();
  }

  @Watch("selectedTab")
  onTabChange(tab: number) {
    const nextTab = tab.toString();

    if (this.$route.params["tab"] !== nextTab) {
      this.$router.replace({
        name: "CategoryDetails",
        params: {
          id: this.$route.params["id"],
          tab: nextTab
        }
      });
    }
  }

  onRefresh() {
    this.refresh();
  }

  onCategoriesClick() {
    this.$router.replace({
      name: "CategoryList"
    });
  }

  onCreateClick() {
    this.categoryItems.onCreateClick();
  }
}
</script>

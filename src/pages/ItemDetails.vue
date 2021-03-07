<template>
  <div>
    <v-toolbar>
      <v-toolbar-title>
        <span @click="onCategoriesClick" class="clickable">{{
          $t("categoryList.title")
        }}</span>
        <span class="ml-2 mr-2">></span>
        <span
          v-if="category !== null"
          class="clickable"
          @click="onCategoryClick"
          >{{ category.name }}</span
        >

        <span class="ml-2 mr-2">></span>
        <span class="clickable" @click="onCategoryClick">{{
          $t("categoryDetails.items.title")
        }}</span>
        <span class="ml-2 mr-2">></span>
        <span v-if="item !== null">{{ item.name }}</span>
      </v-toolbar-title>
      <v-spacer></v-spacer>
    </v-toolbar>

    <v-tabs class="mt-2" v-model="selectedTab" grow>
      <v-tab>{{ $t("itemDetails.properties.title") }}</v-tab>
      <v-tab>{{ $t("itemDetails.qrCode.title") }}</v-tab>
    </v-tabs>

    <v-tabs-items v-model="selectedTab" v-if="item !== null">
      <v-tab-item>
        <item-properties v-model="item" @refresh="onRefresh"></item-properties>
      </v-tab-item>
      <v-tab-item>
        <item-q-r-code :value="item" :code="itemQRCode"></item-q-r-code>
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
import { Item } from "@/models/data/Item";

import LoadingIndicator from "@/components/LoadingIndicator.vue";
import Snackbar from "@/components/Snackbar.vue";
import ItemProperties from "@/components/ItemProperties.vue";
import ItemQRCode from "@/components/ItemQRCode.vue";

@Component({
  components: {
    LoadingIndicator,
    Snackbar,
    ItemProperties,
    ItemQRCode
  }
})
export default class ItemDetails extends Vue {
  @Ref("snackbar")
  private readonly snackbar!: Snackbar;

  private readonly httpResponseHandler = new HttpResponseHandler();

  category: Category | null = null;
  item: Item | null = null;
  itemQRCode: string | null = null;

  selectedTab = 0;

  isLoading = false;

  private async refresh() {
    this.isLoading = true;

    const categoryId = this.$route.params["categoryId"];
    const id = this.$route.params["id"];

    const categoryPromise = this.httpResponseHandler.handle<Category>(
      Services.httpService.get(`${this.endpoint}/category/${categoryId}`)
    );
    const itemPromise = this.httpResponseHandler.handle<Item>(
      Services.httpService.get(
        `${this.endpoint}/category/${categoryId}/item/${id}`
      )
    );
    const itemQRCodePromise = this.httpResponseHandler.handle<string>(
      Services.httpService.get(`${this.endpoint}/qr-code/${id}`)
    );

    const category = await categoryPromise;
    const item = await itemPromise;
    const itemQRCode = await itemQRCodePromise;

    if (category !== null && item !== null && itemQRCode !== null) {
      this.category = plainToClass(Category, category);
      this.item = plainToClass(Item, item);
      this.itemQRCode = itemQRCode;
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
        name: "ItemDetails",
        params: {
          id: this.$route.params["id"],
          categoryId: this.$route.params["categoryId"],
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
  onCategoryClick() {
    this.$router.replace({
      name: "CategoryDetails",
      params: {
        id: this.$route.params["categoryId"],
        tab: "1"
      }
    });
  }
}
</script>

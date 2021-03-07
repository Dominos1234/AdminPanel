<template>
  <v-container fluid>
    <v-row>
      <v-col cols="6">
        <v-card class="mx-auto">
          <v-card-title>
            <v-icon large left>mdi-qrcode</v-icon>
            <span>{{ $t("itemDetails.qrCode.title") }}</span>
            <v-spacer></v-spacer>

            <v-tooltip bottom>
              <template v-slot:activator="{ on, attrs }">
                <v-icon
                  v-bind="attrs"
                  v-on="on"
                  class="mr-2"
                  @click="onDownloadClick()"
                >
                  mdi-download
                </v-icon>
              </template>
              <span>{{ $t("buttons.download") }}</span>
            </v-tooltip>
          </v-card-title>

          <v-card-text class="pl-0 pr-0 pt-0 pb-3">
            <v-img :src="code"></v-img>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts">
import Vue from "vue";
import download from "downloadjs";
import { Component, Prop } from "vue-property-decorator";
import { Item } from "@/models/data/Item";

@Component
export default class ItemQRCode extends Vue {
  @Prop()
  value!: Item;

  @Prop()
  code!: string;

  onDownloadClick() {
    download(this.code, this.value.name);
  }
}
</script>

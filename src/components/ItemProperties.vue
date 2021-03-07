<template>
  <v-container fluid>
    <v-row>
      <v-col cols="6">
        <v-card class="mx-auto">
          <v-card-title>
            <v-icon large left>mdi-image-outline</v-icon>
            <span>{{ $t("itemDetails.properties.images") }}</span>
            <v-spacer></v-spacer>

            <v-tooltip bottom>
              <template v-slot:activator="{ on, attrs }">
                <v-icon
                  v-bind="attrs"
                  v-on="on"
                  small
                  class="mr-2"
                  @click="onCreateImageClick()"
                >
                  mdi-plus
                </v-icon>
              </template>
              <span>{{ $t("buttons.create") }}</span>
            </v-tooltip>

            <v-menu v-if="value.imagesBase64.length > 0" open-on-hover offset-y>
              <template v-slot:activator="{ on, attrs }">
                <v-icon v-bind="attrs" v-on="on" class="ml-2">
                  mdi-menu
                </v-icon>
              </template>

              <v-list>
                <v-list-item
                  v-if="this.activeImage > 0"
                  @click="onMoveImageClick(-1)"
                >
                  <v-list-item-icon>
                    <v-icon>mdi-arrow-up-bold</v-icon>
                  </v-list-item-icon>
                  <v-list-item-title>{{
                    $t("itemDetails.properties.actions.moveUp")
                  }}</v-list-item-title>
                </v-list-item>

                <v-list-item
                  v-if="this.activeImage + 1 < value.imagesBase64.length"
                  @click="onMoveImageClick(1)"
                >
                  <v-list-item-icon>
                    <v-icon>mdi-arrow-down-bold</v-icon>
                  </v-list-item-icon>
                  <v-list-item-title>{{
                    $t("itemDetails.properties.actions.moveDown")
                  }}</v-list-item-title>
                </v-list-item>

                <v-list-item @click="onRemoveImageClick">
                  <v-list-item-icon>
                    <v-icon color="error">mdi-delete</v-icon>
                  </v-list-item-icon>
                  <v-list-item-title>{{
                    $t("itemDetails.properties.actions.delete")
                  }}</v-list-item-title>
                </v-list-item>
              </v-list>
            </v-menu>
          </v-card-title>

          <v-card-text class="pl-0 pr-0 pt-0 pb-3">
            <v-carousel
              v-if="value.imagesBase64.length > 0"
              v-model="activeImage"
            >
              <v-carousel-item
                v-for="(image, index) in value.imagesBase64"
                :key="index"
                :src="image"
                reverse-transition="fade-transition"
                transition="fade-transition"
              ></v-carousel-item> </v-carousel
          ></v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <delete-dialog ref="deleteDialog" @delete="onImageDelete"></delete-dialog>

    <loading-indicator :value="isLoading"></loading-indicator>
    <snackbar ref="snackbar"></snackbar>

    <div class="hidden">
      <input
        type="file"
        ref="fileInput"
        accept="image/png, image/jpeg, image/bmp"
        @change="onImageInputChange"
      />
    </div>
  </v-container>
</template>

<script lang="ts">
import Vue from "vue";
import { Component, Prop, Ref } from "vue-property-decorator";
import { AxiosResponse } from "axios";

import { HttpResponseHandler } from "@/utils/HttpResponseHandler";
import { FileUtils } from "@/utils/FileUtils";

import { Services } from "@/services/Services";
import { IDialog } from "@/models/IDialog";
import { Response } from "@/models/Response";
import { Item } from "@/models/data/Item";

import LoadingIndicator from "@/components/LoadingIndicator.vue";
import Snackbar from "@/components/Snackbar.vue";
import DeleteDialog from "@/components/DeleteDialog.vue";

@Component({
  components: {
    LoadingIndicator,
    Snackbar,
    DeleteDialog
  }
})
export default class ItemProperties extends Vue {
  @Prop()
  value!: Item;

  @Ref("snackbar")
  private readonly snackbar!: Snackbar;

  @Ref("fileInput")
  private readonly fileInput!: HTMLInputElement;

  @Ref("deleteDialog")
  private readonly deleteDialog!: DeleteDialog;

  private readonly httpResponseHandler = new HttpResponseHandler();

  activeImage = 0;

  isLoading = false;

  private async handleItemRequest(
    request: Promise<AxiosResponse<Response>>,
    dialog?: IDialog
  ) {
    this.isLoading = true;

    const response = await this.httpResponseHandler.handle<boolean>(request);

    if (response === true) {
      this.$emit("refresh");
    } else {
      dialog?.show();
    }

    this.isLoading = false;
  }

  private get endpoint() {
    if (Services.authService.isLogged) {
      return "/api/admin";
    }

    return null;
  }

  onCreateImageClick() {
    this.fileInput.click();
  }
  onRemoveImageClick() {
    this.deleteDialog.open(
      this.activeImage,
      this.$t("itemDetails.properties.image").toString()
    );
  }

  onMoveImageClick(offset: number) {
    this.handleItemRequest(
      Services.httpService.post(
        `${this.endpoint}/category/${this.value.categoryId}/item/${this.value.id}/image/${this.activeImage}`,
        offset
      )
    );
  }

  async onImageInputChange() {
    if (this.fileInput.files === null || this.fileInput.files.length !== 1) {
      return;
    }

    const base64 = await FileUtils.readFileAsBase64(this.fileInput.files[0]);

    this.handleItemRequest(
      Services.httpService.post(
        `${this.endpoint}/category/${this.value.categoryId}/item/${this.value.id}/image`,
        base64
      )
    );
  }
  onImageDelete(index: number) {
    this.handleItemRequest(
      Services.httpService.delete(
        `${this.endpoint}/category/${this.value.categoryId}/item/${this.value.id}/image/${index}`
      ),
      this.deleteDialog
    );
  }
}
</script>

<template>
  <v-container fluid>
    <v-row>
      <v-col cols="6">
        <v-card class="mx-auto">
          <v-card-title>
            <v-icon large left>mdi-axis-arrow</v-icon>
            <span>{{ $t("categoryDetails.properties.attributes") }}</span>
            <v-spacer></v-spacer>

            <v-tooltip bottom>
              <template v-slot:activator="{ on, attrs }">
                <v-icon
                  v-bind="attrs"
                  v-on="on"
                  small
                  class="mr-2"
                  @click="onCreateAttributeClick()"
                >
                  mdi-plus
                </v-icon>
              </template>
              <span>{{ $t("buttons.create") }}</span>
            </v-tooltip>
          </v-card-title>

          <v-card-text class="pl-0 pr-0 pt-0 pb-3">
            <v-row
              v-for="attribute in value.attributes"
              :key="attribute.id"
              class="title font-weight-bold pl-4 pr-4 pt-1 pb-1"
              no-gutters
            >
              <span>
                {{ attribute.name }}
              </span>
              <v-spacer></v-spacer>

              <v-tooltip bottom>
                <template v-slot:activator="{ on, attrs }">
                  <v-icon
                    v-bind="attrs"
                    v-on="on"
                    small
                    class="mr-2"
                    @click="onUpdateAttributeClick(attribute)"
                  >
                    mdi-pencil
                  </v-icon>
                </template>
                <span>{{ $t("buttons.edit") }}</span>
              </v-tooltip>

              <v-tooltip bottom>
                <template v-slot:activator="{ on, attrs }">
                  <v-icon
                    v-bind="attrs"
                    v-on="on"
                    small
                    @click="onRemoveAttributeClick(attribute)"
                  >
                    mdi-delete
                  </v-icon>
                </template>
                <span>{{ $t("buttons.delete") }}</span>
              </v-tooltip>
            </v-row>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <edit-dialog
      ref="editDialog"
      :name="i18n.categoryDetails.properties.attribute"
      :i18n="i18n.categoryDetails.properties.fields"
      :fields="editDialogFields"
      @create="onAttributeCreate"
      @update="onAttributeUpdate"
    ></edit-dialog>

    <delete-dialog
      ref="deleteDialog"
      @delete="onAttributeDelete"
    ></delete-dialog>

    <loading-indicator :value="isLoading"></loading-indicator>
    <snackbar ref="snackbar"></snackbar>
  </v-container>
</template>

<script lang="ts">
import Vue from "vue";
import { Component, Prop, Ref } from "vue-property-decorator";
import { AxiosResponse } from "axios";

import { HttpResponseHandler } from "@/utils/HttpResponseHandler";

import { Services } from "@/services/Services";
import { IDialog } from "@/models/IDialog";
import { Response } from "@/models/Response";
import { AttributeName, Category } from "@/models/data/Category";

import LoadingIndicator from "@/components/LoadingIndicator.vue";
import Snackbar from "@/components/Snackbar.vue";
import EditDialog, { Field } from "@/components/EditDialog.vue";
import DeleteDialog from "@/components/DeleteDialog.vue";

@Component({
  components: {
    LoadingIndicator,
    Snackbar,
    EditDialog,
    DeleteDialog
  }
})
export default class CategoryProperties extends Vue {
  @Prop()
  value!: Category;

  @Ref("snackbar")
  private readonly snackbar!: Snackbar;

  @Ref("editDialog")
  private readonly editDialog!: EditDialog;

  @Ref("deleteDialog")
  private readonly deleteDialog!: DeleteDialog;

  private readonly httpResponseHandler = new HttpResponseHandler();

  readonly i18n = {
    categoryDetails: this.$t("categoryDetails")
  };

  readonly editDialogFields: Field[] = [
    {
      name: "id",
      type: "input",
      readonly: "update-only",
      required: "never",
      visible: "update-only"
    },
    {
      name: "name",
      type: "input",
      readonly: "never",
      required: "always",
      visible: "always"
    }
  ];

  isLoading = false;

  private async handleAttributeRequest(
    request: Promise<AxiosResponse<Response>>,
    dialog: IDialog
  ) {
    this.isLoading = true;

    const response = await this.httpResponseHandler.handle<boolean>(request);

    if (response === true) {
      this.$emit("refresh");
    } else {
      dialog.show();
    }

    this.isLoading = false;
  }

  private get endpoint() {
    if (Services.authService.isLogged) {
      return "/api/admin";
    }

    return null;
  }

  onCreateAttributeClick() {
    this.editDialog.open(new AttributeName(""), false);
  }
  onUpdateAttributeClick(attribute: AttributeName) {
    this.editDialog.open(attribute, true);
  }
  onRemoveAttributeClick(attribute: AttributeName) {
    this.deleteDialog.open(attribute, attribute.name);
  }

  onAttributeCreate(attribute: AttributeName) {
    this.handleAttributeRequest(
      Services.httpService.post(
        `${this.endpoint}/category/${this.value.id}/attribute`,
        attribute
      ),
      this.editDialog
    );
  }
  onAttributeUpdate(attribute: AttributeName) {
    this.handleAttributeRequest(
      Services.httpService.post(
        `${this.endpoint}/category/${this.value.id}/attribute/${attribute.id}`,
        attribute
      ),
      this.editDialog
    );
  }
  onAttributeDelete(attribute: AttributeName) {
    this.handleAttributeRequest(
      Services.httpService.delete(
        `${this.endpoint}/category/${this.value.id}/attribute/${attribute.id}`
      ),
      this.deleteDialog
    );
  }
}
</script>

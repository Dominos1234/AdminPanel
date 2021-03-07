<template>
  <div>
    <v-toolbar>
      <v-toolbar-title>{{ $t("categoryList.title") }}</v-toolbar-title>
      <v-spacer></v-spacer>
      <v-tooltip bottom>
        <template v-slot:activator="{ on, attrs }">
          <v-btn
            v-bind="attrs"
            v-on="on"
            color="secondary"
            @click="onCreateClick"
          >
            <v-icon dark>mdi-plus</v-icon>
          </v-btn>
        </template>
        <span>{{ $t("buttons.create") }}</span>
      </v-tooltip>
    </v-toolbar>
    <v-data-table
      class="elevation-1"
      :headers="headers"
      :items="categories"
      :items-per-page="15"
      item-class="class"
      @click:row="onRowClick"
    >
      <template v-slot:[`item.imageBase64`]="{ item }">
        <img :src="item.imageBase64" height="100px" />
      </template>
      <template v-slot:[`item.actions`]="{ item }">
        <v-tooltip bottom>
          <template v-slot:activator="{ on, attrs }">
            <v-icon
              v-bind="attrs"
              v-on="on"
              small
              class="mr-2"
              @click.stop="onUpdateClick(item)"
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
              @click.stop="onRemoveClick(item)"
            >
              mdi-delete
            </v-icon>
          </template>
          <span>{{ $t("buttons.delete") }}</span>
        </v-tooltip>
      </template>
    </v-data-table>

    <edit-dialog
      ref="editDialog"
      :name="i18n.categoryList.type"
      :i18n="i18n.categoryList.fields"
      :fields="editDialogFields"
      @create="onCategoryCreate"
      @update="onCategoryUpdate"
    ></edit-dialog>

    <delete-dialog
      ref="deleteDialog"
      @delete="onCategoryDelete"
    ></delete-dialog>

    <loading-indicator :value="isLoading"></loading-indicator>
    <snackbar ref="snackbar"></snackbar>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import { Component, Ref } from "vue-property-decorator";
import { AxiosResponse } from "axios";
import { plainToClass } from "class-transformer";

import { HttpResponseHandler } from "@/utils/HttpResponseHandler";

import { Services } from "@/services/Services";
import { IDialog } from "@/models/IDialog";
import { Response } from "@/models/Response";
import { Category } from "@/models/data/Category";

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
export default class CategoryList extends Vue {
  @Ref("snackbar")
  private readonly snackbar!: Snackbar;

  @Ref("editDialog")
  private readonly editDialog!: EditDialog;

  @Ref("deleteDialog")
  private readonly deleteDialog!: DeleteDialog;

  private readonly httpResponseHandler = new HttpResponseHandler();

  readonly i18n = {
    categoryList: this.$t("categoryList")
  };

  readonly headers = [
    {
      text: this.$t("categoryList.fields.imageBase64"),
      value: "imageBase64"
    },
    {
      text: this.$t("categoryList.fields.name"),
      value: "name"
    },
    {
      text: this.$t("categoryList.fields.description"),
      value: "description"
    },
    {
      text: this.$t("categoryList.fields.inputAttributes"),
      value: "textAttributes"
    },
    {
      value: "actions",
      sortable: false
    }
  ];

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
    },
    {
      name: "description",
      type: "input",
      readonly: "never",
      required: "never",
      visible: "always"
    },
    {
      name: "imageBase64",
      type: "image",
      readonly: "never",
      required: "never",
      visible: "always"
    },
    {
      name: "inputAttributes",
      type: "list",
      listType: "text",
      readonly: "update-only",
      required: "never",
      visible: "always"
    }
  ];

  categories: Category[] = [];

  isLoading = false;

  private async refresh() {
    this.isLoading = true;

    const categories = await this.httpResponseHandler.handle<Category[]>(
      Services.httpService.get(`${this.endpoint}/category`)
    );

    if (categories !== null) {
      this.categories = plainToClass(Category, categories);
    }

    this.isLoading = false;
  }

  private async handleCategoryRequest(
    request: Promise<AxiosResponse<Response>>,
    dialog: IDialog
  ) {
    this.isLoading = true;

    const response = await this.httpResponseHandler.handle<boolean>(request);

    if (response === true) {
      this.refresh();
    } else {
      dialog.show();

      this.isLoading = false;
    }
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

    this.refresh();
  }

  onCreateClick() {
    this.editDialog.open(new Category(), false);
  }
  onUpdateClick(category: Category) {
    this.editDialog.open(category, true);
  }
  onRemoveClick(category: Category) {
    this.deleteDialog.open(category, category.name);
  }

  onRowClick(category: Category) {
    this.$router.push({
      name: "CategoryDetails",
      params: {
        id: category.id
      }
    });
  }

  onCategoryCreate(category: Category) {
    this.handleCategoryRequest(
      Services.httpService.post(`${this.endpoint}/category`, category),
      this.editDialog
    );
  }
  onCategoryUpdate(category: Category) {
    this.handleCategoryRequest(
      Services.httpService.post(
        `${this.endpoint}/category/${category.id}`,
        category
      ),
      this.editDialog
    );
  }
  onCategoryDelete(category: Category) {
    this.handleCategoryRequest(
      Services.httpService.delete(`${this.endpoint}/category/${category.id}`),
      this.deleteDialog
    );
  }
}
</script>

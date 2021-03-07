<template>
  <v-container fluid>
    <v-data-table
      class="elevation-1"
      :headers="headers"
      :items="value.items"
      :items-per-page="15"
      item-class="class"
      @click:row="onRowClick"
    >
      <template v-slot:[`item.imageBase64`]="{ item }">
        <img :src="item.imageBase64" height="100px" />
      </template>
      <template v-slot:[`item.bookingAuthorizationRequired`]="{ item }">
        <v-checkbox
          v-model="item.bookingAuthorizationRequired"
          disabled
        ></v-checkbox>
      </template>
      <template v-slot:[`item.responsibleUsers`]="{ item }">
        {{ item.getTextResponsibleUsers(users) }}
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
      :name="i18n.categoryDetails.items.item"
      :i18n="i18n.categoryDetails.items.fields"
      :fields="editDialogFields"
      @create="onItemCreate"
      @update="onItemUpdate"
    ></edit-dialog>

    <delete-dialog ref="deleteDialog" @delete="onItemDelete"></delete-dialog>

    <loading-indicator :value="isLoading"></loading-indicator>
    <snackbar ref="snackbar"></snackbar>
  </v-container>
</template>

<script lang="ts">
import Vue from "vue";
import { Component, Prop, Ref } from "vue-property-decorator";
import { AxiosResponse } from "axios";
import { plainToClass } from "class-transformer";

import { HttpResponseHandler } from "@/utils/HttpResponseHandler";

import { Services } from "@/services/Services";
import { IDialog } from "@/models/IDialog";
import { Response } from "@/models/Response";
import { AttributeName, Category } from "@/models/data/Category";
import { Item } from "@/models/data/Item";
import { User } from "@/models/data/User";

import LoadingIndicator from "@/components/LoadingIndicator.vue";
import Snackbar from "@/components/Snackbar.vue";
import EditDialog, { Field } from "@/components/EditDialog.vue";
import DeleteDialog from "@/components/DeleteDialog.vue";
import { SelectOption } from "./EditableList.vue";

@Component({
  components: {
    LoadingIndicator,
    Snackbar,
    EditDialog,
    DeleteDialog
  }
})
export default class CategoryItems extends Vue {
  @Prop()
  value!: Category;

  @Ref("snackbar")
  private readonly snackbar!: Snackbar;

  @Ref("editDialog")
  private readonly editDialog!: EditDialog;

  @Ref("deleteDialog")
  private readonly deleteDialog!: DeleteDialog;

  private readonly httpResponseHandler = new HttpResponseHandler();

  private readonly baseEditDialogFields: Field[] = [
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
      name: "bookingAuthorizationRequired",
      type: "checkbox",
      readonly: "never",
      required: "never",
      visible: "always"
    }
  ];
  private readonly responsibleUsersField: Field = {
    name: "responsibleUsers",
    type: "list",
    listType: "select",
    readonly: "never",
    required: "never",
    visible: "always"
  };

  readonly i18n = {
    categoryDetails: this.$t("categoryDetails")
  };

  readonly baseHeaders = [
    [
      {
        text: this.$t("categoryDetails.items.fields.imageBase64"),
        value: "imageBase64"
      },
      {
        text: this.$t("categoryDetails.items.fields.name"),
        value: "name"
      },
      {
        text: this.$t("categoryDetails.items.fields.description"),
        value: "description"
      },
      {
        text: this.$t(
          "categoryDetails.items.fields.bookingAuthorizationRequired"
        ),
        value: "bookingAuthorizationRequired"
      },
      {
        text: this.$t("categoryDetails.items.fields.responsibleUsers"),
        value: "responsibleUsers"
      }
    ],
    [
      {
        value: "actions",
        sortable: false
      }
    ]
  ];

  editDialogFields: Field[] = [];

  users: User[] = [];

  isLoading = false;

  private async refresh() {
    this.isLoading = true;

    const users = await this.httpResponseHandler.handle<User[]>(
      Services.httpService.get(`${this.endpoint}/user`)
    );

    if (users !== null) {
      this.users = plainToClass(User, users);
    }

    this.isLoading = false;
  }

  private async handleItemRequest(
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

  private updateEditDialogFields() {
    this.editDialogFields = [
      ...this.baseEditDialogFields,
      ...this.value.attributes.map(
        (value: AttributeName): Field => ({
          name: value.id,
          label: value.name,
          type: "input",
          readonly: "never",
          required: "never",
          visible: "always"
        })
      ),
      {
        ...this.responsibleUsersField,
        selectOptions: this.users.map(
          (user: User): SelectOption => ({
            key: user.id,
            text: user.text
          })
        )
      }
    ];
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
      return;
    }

    this.refresh();
  }

  onUpdateClick(item: Item) {
    this.updateEditDialogFields();
    this.editDialog.open(item, true);
  }
  onRemoveClick(item: Item) {
    this.deleteDialog.open(item, item.name);
  }

  onRowClick(item: Item) {
    this.$router.push({
      name: "ItemDetails",
      params: {
        categoryId: item.categoryId,
        id: item.id
      }
    });
  }

  onItemCreate(item: Item) {
    this.handleItemRequest(
      Services.httpService.post(
        `${this.endpoint}/category/${this.value.id}/item`,
        item.getItem()
      ),
      this.editDialog
    );
  }
  onItemUpdate(item: Item) {
    this.handleItemRequest(
      Services.httpService.post(
        `${this.endpoint}/category/${this.value.id}/item/${item.id}`,
        item.getItem()
      ),
      this.editDialog
    );
  }
  onItemDelete(item: Item) {
    this.handleItemRequest(
      Services.httpService.delete(
        `${this.endpoint}/category/${this.value.id}/item/${item.id}`
      ),
      this.deleteDialog
    );
  }

  public onCreateClick() {
    this.updateEditDialogFields();
    this.editDialog.open(new Item(), false);
  }

  get headers(): unknown[] {
    return [
      ...this.baseHeaders[0],
      ...this.value.attributes.map((value: AttributeName) => ({
        text: value.name,
        value: value.id
      })),
      ...this.baseHeaders[1]
    ];
  }
}
</script>

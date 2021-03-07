<template>
  <div>
    <v-toolbar>
      <v-toolbar-title>{{ $t("userList.title") }}</v-toolbar-title>
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
      :headers="headers"
      :items="users"
      :items-per-page="15"
      class="elevation-1"
    >
      <template v-slot:[`item.adminUser`]="{ item }">
        <v-checkbox v-model="item.adminUser" disabled></v-checkbox>
      </template>
      <template v-slot:[`item.actions`]="{ item }">
        <v-tooltip bottom>
          <template v-slot:activator="{ on, attrs }">
            <v-icon
              v-bind="attrs"
              v-on="on"
              small
              class="mr-2"
              @click="onUpdateClick(item)"
            >
              mdi-pencil
            </v-icon>
          </template>
          <span>{{ $t("buttons.edit") }}</span>
        </v-tooltip>

        <v-tooltip bottom>
          <template v-slot:activator="{ on, attrs }">
            <v-icon v-bind="attrs" v-on="on" small @click="onRemoveClick(item)">
              mdi-delete
            </v-icon>
          </template>
          <span>{{ $t("buttons.delete") }}</span>
        </v-tooltip>
      </template>
    </v-data-table>

    <edit-dialog
      ref="editDialog"
      :name="i18n.userList.type"
      :i18n="i18n.userList.fields"
      :fields="editDialogFields"
      @create="onUserCreate"
      @update="onUserUpdate"
    ></edit-dialog>

    <delete-dialog ref="deleteDialog" @delete="onUserDelete"></delete-dialog>

    <loading-indicator :value="isLoading"></loading-indicator>
    <snackbar ref="snackbar"></snackbar>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import { AxiosResponse } from "axios";
import { Component, Ref } from "vue-property-decorator";

import { HttpResponseHandler } from "@/utils/HttpResponseHandler";

import { Services } from "@/services/Services";
import { IDialog } from "@/models/IDialog";
import { Response } from "@/models/Response";
import { ConditionalContainer } from "@/models/ConditionalContainer";
import { User } from "@/models/data/User";

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
export default class UserList extends Vue {
  @Ref("snackbar")
  private readonly snackbar!: Snackbar;

  @Ref("editDialog")
  private readonly editDialog!: EditDialog;

  @Ref("deleteDialog")
  private readonly deleteDialog!: DeleteDialog;

  private readonly httpResponseHandler = new HttpResponseHandler();

  readonly i18n = {
    userList: this.$t("userList")
  };

  readonly headers = [
    {
      text: this.$t("userList.fields.login"),
      value: "login"
    },
    {
      text: this.$t("userList.fields.externalId"),
      value: "externalId"
    },
    {
      text: this.$t("userList.fields.adminUser"),
      value: "adminUser"
    },
    {
      value: "actions",
      sortable: false
    }
  ];

  readonly possibleEditDialogFields: ConditionalContainer<Field, boolean>[] = [
    {
      data: {
        name: "id",
        type: "input",
        readonly: "update-only",
        required: "never",
        visible: "update-only"
      }
    },
    {
      data: {
        name: "login",
        type: "input",
        readonly: "never",
        required: "always",
        visible: "always"
      }
    },
    {
      data: {
        name: "password",
        type: "input",
        readonly: "never",
        required: "create-only",
        visible: "always"
      }
    },
    {
      data: {
        name: "externalId",
        type: "input",
        readonly: "never",
        required: "always",
        visible: "always"
      }
    },
    {
      data: {
        name: "adminUser",
        type: "checkbox",
        readonly: "never",
        required: "never",
        visible: "always"
      },
      isVisible(isMasterAdminLogged) {
        return isMasterAdminLogged;
      }
    }
  ];

  editDialogFields: Field[] = [];

  users: User[] = [];

  isLoading = false;

  private updateEditDialogFields() {
    this.editDialogFields = this.possibleEditDialogFields
      .filter(
        value =>
          !value.isVisible ||
          value.isVisible(Services.authService.isMasterAdminLogged)
      )
      .map(value => value.data);
  }

  private async refresh() {
    this.isLoading = true;

    const users = await this.httpResponseHandler.handle<User[]>(
      Services.httpService.get(`${this.endpoint}/user`)
    );

    if (users !== null) {
      this.users = users;
    }

    this.isLoading = false;
  }

  private async handleUserRequest(
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
    if (Services.authService.isMasterAdminLogged) {
      return "/api/master-admin";
    }

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
    this.updateEditDialogFields();
    this.editDialog.open(new User(), false);
  }
  onUpdateClick(user: User) {
    if (
      user.adminUser &&
      !Services.authService.isMasterAdminLogged &&
      Services.authService.loggedUser?.id !== user.id
    ) {
      this.snackbar.show(this.$t("http.missingPermissions").toString());
      return;
    }

    this.updateEditDialogFields();
    this.editDialog.open(user, true);
  }
  onRemoveClick(user: User) {
    if (user.adminUser && !Services.authService.isMasterAdminLogged) {
      this.snackbar.show(this.$t("http.missingPermissions").toString());
      return;
    }

    this.deleteDialog.open(user, user.login);
  }

  onUserCreate(user: User) {
    this.handleUserRequest(
      Services.httpService.post(`${this.endpoint}/user`, user),
      this.editDialog
    );
  }
  onUserUpdate(user: User) {
    this.handleUserRequest(
      Services.httpService.post(`${this.endpoint}/user/${user.id}`, user),
      this.editDialog
    );
  }
  onUserDelete(user: User) {
    this.handleUserRequest(
      Services.httpService.delete(`${this.endpoint}/user/${user.id}`),
      this.deleteDialog
    );
  }
}
</script>

<template>
  <v-container>
    <v-row class="mt-5">
      <v-col cols="1"></v-col>
      <v-col cols="4">
        <h1 class="display-1 font-weight-thin mb-4">
          {{ i18n.login.admin.title }}
        </h1>

        <v-form lazy-validation ref="adminForm">
          <v-text-field
            v-model="login"
            :label="i18n.login.admin.login"
            :rules="inputValidator.rules.login"
          ></v-text-field>
          <v-text-field
            v-model="password"
            class="mt-2"
            :label="i18n.login.admin.password"
            :append-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'"
            :type="showPassword ? 'text' : 'password'"
            :rules="inputValidator.rules.password"
            @click:append="showPassword = !showPassword"
          ></v-text-field>
          <v-btn class="mt-3" color="secondary" @click="onAdminLoginClick">{{
            $t("buttons.login")
          }}</v-btn>
        </v-form>
      </v-col>
      <v-col cols="2"></v-col>
      <v-col cols="4">
        <h1 class="display-1 font-weight-thin mb-4">
          {{ i18n.login.masterAdmin.title }}
        </h1>

        <v-form lazy-validation ref="masterAdminForm">
          <v-text-field
            v-model="masterKey"
            class="mt-2"
            :label="i18n.login.masterAdmin.key"
            :append-icon="showKey ? 'mdi-eye' : 'mdi-eye-off'"
            :type="showKey ? 'text' : 'password'"
            :rules="inputValidator.rules.masterKey"
            @click:append="showKey = !showKey"
          ></v-text-field>
          <v-btn
            class="mt-3"
            color="secondary"
            @click="onMasterAdminLoginClick"
            >{{ $t("buttons.login") }}</v-btn
          >
        </v-form>
      </v-col>
      <v-col cols="1"></v-col>
    </v-row>

    <loading-indicator :value="isLoading"></loading-indicator>
    <snackbar ref="snackbar"></snackbar>
  </v-container>
</template>

<script lang="ts">
import Vue from "vue";
import { AxiosResponse } from "axios";
import { Component, Ref } from "vue-property-decorator";

import { InputValidator } from "@/utils/InputValidator";
import { HttpResponseHandler } from "@/utils/HttpResponseHandler";

import { Services } from "@/services/Services";
import { Response } from "@/models/Response";
import { User } from "@/models/data/User";

import LoadingIndicator from "@/components/LoadingIndicator.vue";
import Snackbar from "@/components/Snackbar.vue";

@Component({
  components: {
    LoadingIndicator,
    Snackbar
  }
})
export default class Login extends Vue {
  @Ref("adminForm")
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private readonly adminForm: any;

  @Ref("masterAdminForm")
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private readonly masterAdminForm: any;

  @Ref("snackbar")
  private readonly snackbar!: Snackbar;

  private readonly httpResponseHandler = new HttpResponseHandler();

  readonly i18n = {
    login: this.$t("login")
  };

  readonly inputValidator = new InputValidator().withRequiredFields([
    "login",
    "password",
    "masterKey"
  ]);

  login = "";
  password = "";

  masterKey = "";

  showPassword = false;
  showKey = false;

  isLoading = false;

  private async handleLoginRequest(
    request: Promise<AxiosResponse<Response>>,
    masterAdminLogin: boolean
  ) {
    this.isLoading = true;

    const user = await this.httpResponseHandler.handle<User>(request);

    Services.authService.setLoggedUser(user, masterAdminLogin);

    if (user !== null) {
      this.$router.replace({
        name: "CategoryList"
      });
    }

    this.isLoading = false;
  }

  mounted() {
    this.httpResponseHandler.init(this, this.snackbar);
  }

  onAdminLoginClick() {
    if (this.adminForm.validate()) {
      this.handleLoginRequest(
        Services.httpService.post("/api/admin/login", {
          login: this.login,
          password: this.password
        }),
        false
      );
    }
  }
  onMasterAdminLoginClick() {
    if (this.masterAdminForm.validate()) {
      this.handleLoginRequest(
        Services.httpService.post("/api/master-admin/login", {
          key: this.masterKey
        }),
        true
      );
    }
  }
}
</script>

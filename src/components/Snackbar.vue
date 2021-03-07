<template>
  <v-snackbar v-model="visible">
    {{ message }}
    <v-btn color="blue" text @click="visible = false">{{
      $t("buttons.close")
    }}</v-btn>
  </v-snackbar>
</template>

<script lang="ts">
import Vue from "vue";
import { Component } from "vue-property-decorator";
import { ISnackbar } from "@/models/ISnackbar";

@Component
export default class Snackbar extends Vue implements ISnackbar {
  visible = false;
  message = "";

  public show(message: string) {
    this.message = message;
    this.visible = true;
  }
}
</script>

<template>
  <v-dialog v-model="isVisible" width="50%" v-if="item !== null">
    <v-card>
      <v-card-title class="headline grey lighten-2" primary-title>{{
        $t(`deleteDialog.title`, [name])
      }}</v-card-title>
      <v-card-text class="pt-5">{{ $t(`deleteDialog.text`) }}</v-card-text>
      <v-divider></v-divider>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="secondary" text @click="isVisible = false">{{
          $t("buttons.close")
        }}</v-btn>
        <v-btn color="error" text @click="onDeleteClick">{{
          $t("buttons.delete")
        }}</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script lang="ts">
import Vue from "vue";
import { Component, Emit } from "vue-property-decorator";
import { IDialog } from "@/models/IDialog";

@Component
export default class DeleteDialog extends Vue implements IDialog {
  item: unknown | null = null;

  name = "";

  isVisible = false;

  @Emit("delete")
  onDeleteClick() {
    this.isVisible = false;

    return this.item;
  }

  public open(item: unknown, name: string) {
    this.item = item;
    this.name = name;
    this.show();
  }

  public show() {
    this.isVisible = true;
  }
  public hide() {
    this.isVisible = false;
  }
}
</script>

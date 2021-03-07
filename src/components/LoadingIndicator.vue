<template>
  <v-overlay :value="value">
    <v-progress-circular indeterminate size="64"></v-progress-circular>
  </v-overlay>
</template>

<script lang="ts">
import Vue from "vue";
import { Component, Prop } from "vue-property-decorator";

@Component
export default class LoadingIndicator extends Vue {
  @Prop()
  value?: boolean;
}
</script>

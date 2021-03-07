<template>
  <v-row no-gutters>
    <v-menu
      v-if="type === 'date' || type === 'dateTime'"
      v-model="showDatePicker"
      min-width="290px"
      :close-on-content-click="false"
      :disabled="disabled"
    >
      <template v-slot:activator="{ on, attrs }">
        <v-text-field
          v-model="dateValue"
          :label="formattedDateLabel"
          :disabled="disabled"
          prepend-icon="mdi-calendar"
          readonly
          outlined
          v-bind="attrs"
          v-on="on"
        ></v-text-field>
      </template>
      <v-date-picker v-model="dateValue" @change="onInput"></v-date-picker>
    </v-menu>

    <v-menu
      v-if="type === 'time' || type === 'dateTime'"
      v-model="showTimePicker"
      min-width="290px"
      :close-on-content-click="false"
      :disabled="disabled"
    >
      <template v-slot:activator="{ on, attrs }">
        <v-text-field
          v-model="timeValue"
          :class="type === 'dateTime' ? 'ml-3' : ''"
          :label="label"
          :disabled="disabled"
          prepend-icon="mdi-clock-time-four-outline"
          readonly
          outlined
          v-bind="attrs"
          v-on="on"
        ></v-text-field>
      </template>
      <v-time-picker
        v-model="timeValue"
        @change="onInput"
        format="24hr"
      ></v-time-picker>
    </v-menu>
  </v-row>
</template>

<script lang="ts">
import Vue from "vue";
import { Component, Prop, Emit, Watch } from "vue-property-decorator";

@Component
export default class DateTimeInput extends Vue {
  @Prop()
  value!: Date | null;

  @Prop()
  label!: string;

  @Prop({
    default: null
  })
  dateLabel!: string | null;

  @Prop()
  type!: "date" | "time" | "dateTime";

  @Prop({
    default: false
  })
  disabled!: boolean;

  dateValue = "";
  timeValue = "";

  showDatePicker = false;
  showTimePicker = false;

  mounted() {
    this.updateValue();
  }

  @Watch("value")
  updateValue() {
    if (this.value === null) {
      this.dateValue = "";
      this.timeValue = "";
      return;
    }

    const time = this.value.getTime();

    if (Number.isNaN(time)) {
      return;
    }

    const date = new Date(time - this.value.getTimezoneOffset() * 60 * 1000);

    const isoString = date.toISOString();

    this.dateValue = isoString.substr(0, 10);
    this.timeValue = isoString.substr(11, 5);
  }

  @Watch("timeValue")
  @Emit("input")
  onTimeValueChange() {
    return new Date(`${this.dateValue} ${this.timeValue}`);
  }

  @Emit("input")
  onInput() {
    this.showDatePicker = false;
    this.showTimePicker = false;

    return new Date(`${this.dateValue} ${this.timeValue}`);
  }

  get formattedDateLabel() {
    if (this.dateLabel !== null) {
      return this.dateLabel;
    }

    return this.label;
  }
}
</script>

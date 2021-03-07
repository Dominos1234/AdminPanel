<template>
  <v-col class="pa-0">
    <v-row no-gutters class="mb-2">
      <v-col align-self="center" class="flex-grow-0">
        <div class="single-line">{{ title }}</div>
      </v-col>
      <v-col class="pl-2">
        <v-btn
          v-if="!disabled"
          icon
          x-large
          color="primary"
          @click="onAddClick"
        >
          <v-icon>mdi-plus</v-icon>
        </v-btn>
      </v-col>
    </v-row>
    <v-row no-gutters v-for="row in rows" :key="row.index">
      <v-col>
        <v-text-field
          v-if="type === 'text'"
          v-model="row.value"
          outlined
          :disabled="disabled"
          @change="onInput"
        ></v-text-field>

        <v-select
          v-if="type === 'select'"
          v-model="row.value"
          outlined
          item-text="text"
          item-value="key"
          :items="selectOptions"
          :disabled="disabled"
          @change="onInput"
        ></v-select>
      </v-col>
      <v-col v-if="!disabled" class="flex-grow-0 single-line pl-2">
        <v-btn
          icon
          x-large
          color="secondary"
          :disabled="row.index === 0"
          @click="onMoveUpClick(row)"
        >
          <v-icon>mdi-arrow-up-bold</v-icon>
        </v-btn>
        <v-btn
          icon
          x-large
          color="secondary"
          :disabled="row.index + 1 === rows.length"
          @click="onMouseDownClick(row)"
        >
          <v-icon>mdi-arrow-down-bold</v-icon>
        </v-btn>
        <v-btn icon x-large color="error" @click="onRemoveClick(row)">
          <v-icon>mdi-minus-circle</v-icon>
        </v-btn>
      </v-col>
    </v-row>
  </v-col>
</template>

<script lang="ts">
import Vue from "vue";
import { Component, Prop, Emit, Watch } from "vue-property-decorator";

interface Row {
  index: number;
  value: string;
}

export interface SelectOption {
  key: string;
  text: string;
}

@Component
export default class EditableList extends Vue {
  @Prop()
  value!: string[];

  @Prop()
  title!: string;

  @Prop({
    default: "text"
  })
  type!: "text" | "select";

  @Prop({
    default: false
  })
  disabled!: boolean;

  @Prop({
    default: () => []
  })
  selectOptions!: SelectOption[];

  rows: Row[] = [];

  mounted() {
    this.updateValue();
  }

  onAddClick() {
    this.rows.push({
      index: this.rows.length,
      value: ""
    });
  }

  onMoveUpClick(row: Row) {
    this.moveRow(row, -1);
  }

  onMouseDownClick(row: Row) {
    this.moveRow(row, 1);
  }

  onRemoveClick(row: Row) {
    this.rows.splice(row.index, 1);

    for (let index = row.index; index < this.rows.length; ++index) {
      this.rows[index].index = index;
    }
  }

  moveRow(row: Row, step: number) {
    row.index += step;

    const rowAtPosition = this.rows[row.index];

    rowAtPosition.index -= step;

    this.rows[row.index] = row;
    this.rows[rowAtPosition.index] = rowAtPosition;
  }

  @Watch("value")
  updateValue() {
    if (this.value.length > 0) {
      this.rows = this.value.map((item, index) => ({
        index,
        value: item
      }));
    } else {
      this.rows = [
        {
          index: 0,
          value: ""
        }
      ];
    }
  }

  @Emit("input")
  onInput() {
    return this.rows.filter(row => row.value).map(row => row.value);
  }
}
</script>

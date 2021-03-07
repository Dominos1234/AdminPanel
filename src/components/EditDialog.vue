<template>
  <v-dialog v-model="isVisible" width="50%" persistent v-if="item !== null">
    <v-card>
      <v-toolbar class="white--text indigo" dark>
        <v-toolbar-title>{{ title }}</v-toolbar-title>
      </v-toolbar>
      <v-form ref="form" class="mt-4 mr-5 ml-5" lazy-validation>
        <div v-for="field in fields" :key="field.name">
          <div v-if="field.visible === 'always' || isUpdateMode">
            <v-text-field
              v-if="field.type === 'input'"
              v-model="item[field.name]"
              :rules="inputValidator.rules[field.name]"
              :label="field.label || i18n[field.name]"
              :disabled="field.readonly === 'update-only' && isUpdateMode"
            ></v-text-field>

            <date-time-input
              v-if="
                field.type === 'time' ||
                  field.type === 'date' ||
                  field.type === 'dateTime'
              "
              v-model="item[field.name]"
              :type="field.type"
              :label="field.label || i18n[field.name]"
              :dateLabel="i18n[field.extraLabel]"
              :disabled="field.readonly === 'update-only' && isUpdateMode"
            ></date-time-input>

            <v-checkbox
              v-if="field.type === 'checkbox'"
              v-model="item[field.name]"
              :label="field.label || i18n[field.name]"
              :disabled="field.readonly === 'update-only' && isUpdateMode"
            ></v-checkbox>

            <v-select
              v-if="field.type === 'select'"
              v-model="item[field.name]"
              item-text="text"
              item-value="key"
              clearable
              :label="field.label || i18n[field.name]"
              :items="field.selectOptions"
              :disabled="field.readonly === 'update-only' && isUpdateMode"
            ></v-select>

            <v-file-input
              v-if="field.type === 'image'"
              :ref="field.name"
              :label="field.label || i18n[field.name]"
              accept="image/png, image/jpeg, image/bmp"
              prepend-icon="mdi-camera"
            ></v-file-input>

            <editable-list
              v-if="field.type === 'list'"
              v-model="item[field.name]"
              :title="field.label || i18n[field.name]"
              :type="field.listType"
              :selectOptions="field.selectOptions"
              :disabled="field.readonly === 'update-only' && isUpdateMode"
            ></editable-list>
          </div>
        </div>
      </v-form>
      <div class="mt-2 pb-2 pr-2 d-flex justify-end">
        <v-btn
          class="mr-2"
          color="secondary"
          tile
          dark
          @click="isVisible = false"
          >{{ $t("buttons.close") }}
        </v-btn>

        <slot v-bind:item="item">
          <v-btn
            v-if="!isUpdateMode"
            color="primary"
            tile
            @click="onCreateClick()"
            >{{ $t("buttons.create") }}
          </v-btn>
          <v-btn
            v-if="isUpdateMode"
            color="primary"
            tile
            @click="onUpdateClick()"
            >{{ $t("buttons.save") }}
          </v-btn>
        </slot>
      </div>
    </v-card>
  </v-dialog>
</template>

<script lang="ts">
import Vue from "vue";
import { Component, Prop, Emit, Ref } from "vue-property-decorator";
import { classToClass } from "class-transformer";
import { FileUtils } from "@/utils/FileUtils";
import { InputValidator } from "@/utils/InputValidator";
import { IDialog } from "@/models/IDialog";

import EditableList, { SelectOption } from "@/components/EditableList.vue";
import DateTimeInput from "@/components/DateTimeInput.vue";

export interface Field {
  name: string;
  label?: string;
  extraLabel?: string;
  type:
    | "input"
    | "time"
    | "date"
    | "dateTime"
    | "checkbox"
    | "select"
    | "image"
    | "list";
  visible: "always" | "update-only";
  readonly: "never" | "update-only";
  required: "always" | "never" | "create-only";

  listType?: "text" | "select";
  selectOptions?: SelectOption[];
}

@Component({
  components: {
    EditableList,
    DateTimeInput
  }
})
export default class EditDialog extends Vue implements IDialog {
  @Prop()
  fields!: Field[];

  @Prop()
  name!: string;

  @Prop()
  i18n!: unknown;

  @Prop({
    default: true
  })
  formatTitle!: boolean;

  @Ref("form")
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private readonly form: any;

  inputValidator = new InputValidator();

  item: unknown | null = null;

  isUpdateMode = false;
  isVisible = false;

  @Emit("create")
  private handleCreate() {
    this.isVisible = false;

    return this.item;
  }

  @Emit("update")
  private handleUpdate() {
    this.isVisible = false;

    return this.item;
  }

  private async setImageBase64() {
    const fields = this.fields.filter(field => field.type === "image");

    for (const field of fields) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const files = (this.$refs[field.name] as any)[0]
        .internalArrayValue as File[];

      if (files.length === 0) {
        continue;
      }

      const base64 = await FileUtils.readFileAsBase64(files[0]);

      if (base64 !== null) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (this.item as any)[field.name] = base64;
      }
    }
  }

  async onCreateClick() {
    if (this.form.validate()) {
      await this.setImageBase64();

      this.handleCreate();
    }
  }

  async onUpdateClick() {
    if (this.form.validate()) {
      await this.setImageBase64();

      this.handleUpdate();
    }
  }

  get title() {
    if (!this.formatTitle) {
      return this.name;
    }

    const type = this.isUpdateMode ? "edit" : "create";

    return this.$t(`editDialog.title.${type}`, [this.name]);
  }

  public open(item: unknown, isUpdateMode: boolean) {
    this.inputValidator = new InputValidator().withRequiredFields(
      this.fields
        .filter(
          field =>
            field.required === "always" ||
            (field.required === "create-only" && !isUpdateMode)
        )
        .map(field => field.name)
    );

    this.item = classToClass(item);
    this.isUpdateMode = isUpdateMode;
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

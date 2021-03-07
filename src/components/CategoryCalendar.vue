<template>
  <v-container fluid>
    <v-row>
      <v-col cols="3">
        <date-time-input
          v-model="filter.date"
          type="date"
          :label="i18n.categoryDetails.calendar.filter.date"
        ></date-time-input>
      </v-col>
      <v-col cols="3">
        <v-select
          v-model="filter.items"
          :label="i18n.categoryDetails.calendar.filter.items"
          :items="value.items"
          item-text="name"
          item-value="id"
          outlined
          multiple
        ></v-select>
      </v-col>
      <v-col cols="3">
        <v-text-field
          v-model="filter.days"
          :label="i18n.categoryDetails.calendar.filter.days"
          outlined
          readonly
        >
        </v-text-field>
      </v-col>
      <v-col>
        <v-btn
          class="mt-2 mr-3"
          color="secondary"
          fab
          small
          @click="onDayFilterMinusClick"
        >
          <v-icon>
            mdi-minus
          </v-icon>
        </v-btn>
        <v-btn
          class="mt-2"
          color="secondary"
          fab
          small
          @click="onDayFilterPlusClick"
        >
          <v-icon>
            mdi-plus
          </v-icon>
        </v-btn>
      </v-col>
    </v-row>
    <v-calendar
      color="primary"
      type="category"
      event-start="startTime"
      event-end="endTime"
      event-category="itemId"
      category-show-all
      :start="filter.date"
      :category-days="filter.days"
      :categories="items"
      :events="bookings"
      :event-timed="() => true"
      :event-color="getBookingColor"
      @click:time-category="onDateClick"
      @click:event="onBookingClick"
    >
      <template v-slot:category="{ category }">
        <div class="text-center">
          {{ getItemName(category) }}
        </div>
      </template>
    </v-calendar>

    <edit-dialog
      ref="editDialog"
      :name="i18n.categoryDetails.calendar.booking"
      :i18n="i18n.categoryDetails.calendar.fields"
      :fields="editDialogFields"
      @create="onBookingCreate"
    >
    </edit-dialog>

    <edit-dialog
      ref="displayDialog"
      :name="i18n.categoryDetails.calendar.booking"
      :i18n="i18n.categoryDetails.calendar.fields"
      :fields="editDialogFields"
      :formatTitle="false"
    >
      <template v-slot:default="{ item }">
        <v-btn
          v-if="!item.confirmed"
          class="mr-2"
          color="primary"
          tile
          @click="onConfirmClick(item)"
        >
          {{ $t("buttons.confirm") }}
        </v-btn>
        <v-btn color="error" tile @click="onRemoveClick(item)">
          {{ $t("buttons.delete") }}
        </v-btn>
      </template>
    </edit-dialog>

    <delete-dialog ref="deleteDialog" @delete="onBookingDelete"></delete-dialog>

    <loading-indicator :value="isLoading"></loading-indicator>
    <snackbar ref="snackbar"></snackbar>
  </v-container>
</template>

<script lang="ts">
import Vue from "vue";
import { Component, Prop, Ref } from "vue-property-decorator";
import { plainToClass } from "class-transformer";
import { AxiosResponse } from "axios";

import { HttpResponseHandler } from "@/utils/HttpResponseHandler";

import { Services } from "@/services/Services";
import { IDialog } from "@/models/IDialog";
import { Response } from "@/models/Response";
import { Category } from "@/models/data/Category";
import { Booking } from "@/models/data/Booking";

import LoadingIndicator from "@/components/LoadingIndicator.vue";
import Snackbar from "@/components/Snackbar.vue";
import DateTimeInput from "@/components/DateTimeInput.vue";
import EditDialog, { Field } from "@/components/EditDialog.vue";
import DeleteDialog from "@/components/DeleteDialog.vue";

@Component({
  components: {
    LoadingIndicator,
    Snackbar,
    DateTimeInput,
    EditDialog,
    DeleteDialog
  }
})
export default class CategoryCalendar extends Vue {
  @Prop()
  value!: Category;

  @Ref("snackbar")
  private readonly snackbar!: Snackbar;

  @Ref("editDialog")
  private readonly editDialog!: EditDialog;

  @Ref("displayDialog")
  private readonly displayDialog!: EditDialog;

  @Ref("deleteDialog")
  private readonly deleteDialog!: DeleteDialog;

  private readonly httpResponseHandler = new HttpResponseHandler();

  private readonly constants = {
    defaultDisplayedItems: 5,
    defaultDisplayedDays: 7,
    defaultBookingIntervalInMinutes: 60
  };

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
      readonly: "update-only",
      required: "always",
      visible: "always"
    },
    {
      name: "user",
      type: "input",
      readonly: "update-only",
      required: "never",
      visible: "update-only"
    },
    {
      name: "startTime",
      extraLabel: "startDate",
      type: "dateTime",
      readonly: "update-only",
      required: "always",
      visible: "always"
    },
    {
      name: "endTime",
      extraLabel: "endDate",
      type: "dateTime",
      readonly: "update-only",
      required: "always",
      visible: "always"
    },
    {
      name: "creationTime",
      type: "dateTime",
      readonly: "update-only",
      required: "never",
      visible: "update-only"
    },
    {
      name: "repeatInterval",
      type: "input",
      readonly: "update-only",
      required: "never",
      visible: "always"
    },
    {
      name: "repeatIntervalUnit",
      type: "select",
      readonly: "update-only",
      required: "never",
      visible: "always",
      selectOptions: ["d", "w", "m"].map(value => ({
        key: value,
        text: this.$t(
          `categoryDetails.calendar.repeatIntervalUnit.${value}`
        ).toString()
      }))
    },
    {
      name: "repeatEndTime",
      type: "dateTime",
      readonly: "update-only",
      required: "never",
      visible: "always"
    },
    {
      name: "confirmed",
      type: "checkbox",
      readonly: "update-only",
      required: "never",
      visible: "update-only"
    }
  ];

  readonly i18n = {
    categoryDetails: this.$t("categoryDetails")
  };

  filter: {
    date: Date;
    days: string;
    items: string[];
  } = {
    date: new Date(),
    days: "4",
    items: []
  };

  showDatePicker = false;
  isLoading = false;

  private getItem(id: string) {
    return this.value.items.find(item => item.id === id);
  }

  private async handleBookingRequest(
    request: Promise<AxiosResponse<Response>>,
    dialog: IDialog
  ) {
    this.isLoading = true;

    const response = await this.httpResponseHandler.handle<boolean>(request);

    if (response === true) {
      this.displayDialog.hide();
      this.$emit("refresh");
    } else {
      dialog.show();
    }

    this.isLoading = false;
  }

  private get endpoint() {
    if (Services.authService.isLogged) {
      return "/api/admin";
    }

    return null;
  }

  mounted() {
    this.httpResponseHandler.init(this, this.snackbar);

    this.filter.days = this.constants.defaultDisplayedDays.toString();
    this.filter.items = this.value.items
      .slice(0, this.constants.defaultDisplayedItems)
      .map(value => value.id);
  }

  onDayFilterMinusClick() {
    this.filter.days = Math.max(1, parseInt(this.filter.days) - 1).toString();
  }
  onDayFilterPlusClick() {
    this.filter.days = (parseInt(this.filter.days) + 1).toString();
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onDateClick(event: any) {
    if (this.displayDialog.isVisible) {
      return;
    }

    if (Services.authService.isMasterAdminLogged) {
      this.snackbar.show(this.$t("http.masterAdminNotAllowed").toString());
      return;
    }

    const hour = event.time.split(":")[0];

    const startTime = new Date(`${event.date} ${hour}:00`);
    const endTime = new Date(
      startTime.getTime() +
        this.constants.defaultBookingIntervalInMinutes * 60 * 1000
    );

    this.editDialog.open(
      new Booking(event.category, startTime, endTime),
      false
    );
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onBookingClick(event: any) {
    const booking: Booking = event.event;

    this.displayDialog.open(booking, true);
  }

  onConfirmClick(booking: Booking) {
    const copy = plainToClass(Booking, booking);

    copy.confirmed = true;

    this.onBookingUpdate(copy);
  }
  onRemoveClick(booking: Booking) {
    this.deleteDialog.open(booking, booking.name);
  }

  onBookingCreate(booking: Booking) {
    if (booking.startTime < new Date()) {
      this.snackbar.show(
        this.$t("categoryDetails.calendar.error.bookingInPast").toString()
      );

      this.editDialog.show();
      return;
    }

    if (booking.startTime > booking.endTime) {
      this.snackbar.show(
        this.$t(
          "categoryDetails.calendar.error.endTimeGreaterThanStartTime"
        ).toString()
      );

      this.editDialog.show();
      return;
    }

    this.handleBookingRequest(
      Services.httpService.post(
        `${this.endpoint}/category/${this.value.id}/item/${booking.itemId}/booking`,
        booking
      ),
      this.editDialog
    );
  }
  onBookingUpdate(booking: Booking) {
    this.handleBookingRequest(
      Services.httpService.post(
        `${this.endpoint}/category/${this.value.id}/item/${booking.itemId}/booking/${booking.id}`,
        booking
      ),
      this.editDialog
    );
  }
  onBookingDelete(booking: Booking) {
    this.handleBookingRequest(
      Services.httpService.delete(
        `${this.endpoint}/category/${this.value.id}/item/${booking.itemId}/booking/${booking.id}`
      ),
      this.deleteDialog
    );
  }

  getItemName(id: string) {
    return this.getItem(id)?.name;
  }

  getBookingColor(booking: Booking) {
    if (booking.userId === Services.authService.loggedUser?.id) {
      return booking.confirmed ? "green" : "light-green lighten-3";
    }

    return booking.confirmed ? "blue" : "light-blue lighten-3";
  }

  get items() {
    return this.filter.items.map(value => this.getItem(value)?.id);
  }

  get bookings() {
    return this.value.items
      .filter(item => this.filter.items.some(filter => filter === item.id))
      .flatMap(item => item.bookings);
  }
}
</script>

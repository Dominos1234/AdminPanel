import { Type } from "class-transformer/decorators";
import "reflect-metadata";

export class Booking {
  id: string;
  itemId: string;
  categoryId: string;
  userId: string;

  name: string;
  user: string;

  @Type(() => Date)
  startTime: Date;

  @Type(() => Date)
  endTime: Date;

  @Type(() => Date)
  creationTime: Date;

  repeatInterval: string;
  repeatIntervalUnit: string;
  repeatEndTime: Date | null;

  confirmed: boolean;

  constructor(itemId: string, startTime: Date, endTime: Date) {
    this.id = "";
    this.itemId = itemId;
    this.categoryId = "";
    this.userId = "";

    this.name = "";
    this.user = "";

    this.startTime = startTime;
    this.endTime = endTime;
    this.creationTime = new Date();

    this.repeatInterval = "";
    this.repeatIntervalUnit = "";
    this.repeatEndTime = null;

    this.confirmed = false;
  }
}

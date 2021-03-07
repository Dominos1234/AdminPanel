import { Type } from "class-transformer/decorators";
import { User } from "./User";
import { Booking } from "./Booking";
import "reflect-metadata";

export class AttributeValue {
  id: string;
  value: string;

  constructor(id: string, value: string) {
    this.id = id;
    this.value = value;
  }
}

export class Item {
  id: string;
  categoryId: string;
  name: string;
  description: string;
  imagesBase64: string[];
  attributes: AttributeValue[];

  bookingAuthorizationRequired: boolean;
  responsibleUsers: string[];

  @Type(() => Booking)
  bookings: Booking[];

  constructor(item: Item | null = null) {
    if (item === null) {
      this.id = "";
      this.categoryId = "";
      this.name = "";
      this.description = "";
      this.imagesBase64 = [];
      this.attributes = [];

      this.bookingAuthorizationRequired = false;
      this.responsibleUsers = [];
    } else {
      this.id = item.id;
      this.categoryId = item.categoryId;
      this.name = item.name;
      this.description = item.description;
      this.imagesBase64 = item.imagesBase64;
      this.attributes = item.attributes;

      this.bookingAuthorizationRequired = item.bookingAuthorizationRequired;
      this.responsibleUsers = item.responsibleUsers;
    }

    this.bookings = [];
  }

  public getItem(): Item {
    const expectedProperties = [
      "id",
      "categoryId",
      "name",
      "description",
      "imagesBase64",
      "attributes",
      "bookingAuthorizationRequired",
      "responsibleUsers",
      "bookings"
    ];

    const properties = Object.keys(this);
    const item = new Item(this);

    item.attributes = properties
      .filter(property => !expectedProperties.includes(property))
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      .map(property => new AttributeValue(property, (this as any)[property]));

    return item;
  }

  public createAttributes() {
    this.attributes.forEach(value => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (this as any)[value.id] = value.value;
    });
  }

  public getTextResponsibleUsers(users: User[]) {
    return this.responsibleUsers
      .map(row => users.find(user => user.id === row))
      .filter(row => row !== undefined)
      .map(row => row?.text)
      .join(", ");
  }

  public get imageBase64() {
    return this.imagesBase64.length > 0 ? this.imagesBase64[0] : "";
  }

  public get class() {
    return "clickable";
  }
}

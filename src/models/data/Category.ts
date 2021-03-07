import { Type } from "class-transformer/decorators";
import { Item } from "./Item";
import "reflect-metadata";

export class AttributeName {
  id: string;
  name: string;

  constructor(name: string) {
    this.id = "";
    this.name = name;
  }
}

export class Category {
  id: string;
  name: string;
  description: string;
  imageBase64: string;
  attributes: AttributeName[];

  @Type(() => Item)
  items: Item[];

  constructor() {
    this.id = "";
    this.name = "";
    this.description = "";
    this.imageBase64 = "";
    this.attributes = [];
    this.items = [];
  }

  public createItemsAttributes() {
    this.items.forEach(item => item.createAttributes());
  }

  public get inputAttributes() {
    return this.attributes.map(attribute => attribute.name);
  }
  public set inputAttributes(values: string[]) {
    this.attributes = values.map(value => new AttributeName(value));
  }

  public get textAttributes() {
    return this.inputAttributes.join(", ");
  }

  public get class() {
    return "clickable";
  }
}

export class User {
  id: string;
  login: string;
  password: string;
  externalId: string;
  adminUser: boolean;

  constructor() {
    this.id = "";
    this.login = "";
    this.password = "";
    this.externalId = "";
    this.adminUser = false;
  }

  get text() {
    return `${this.externalId} (${this.login})`;
  }
}

export class InputValidator {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  rules: any;

  constructor() {
    this.rules = {};
  }

  public withRequiredFields(fields: string[]) {
    fields.forEach(field => {
      if (!(field in this.rules)) {
        this.rules[field] = [];
      }

      this.rules[field].push(this.getRequiredRule());
    });

    return this;
  }

  public getRequiredRule() {
    return (value: string) => !!value || "Field is required";
  }
}

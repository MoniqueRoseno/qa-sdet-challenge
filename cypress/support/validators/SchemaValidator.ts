import Ajv, { ErrorObject } from "ajv";

export class SchemaValidator {
  private static readonly ajv = new Ajv({
    allErrors: true,
    strict: false,
  });

  static validate(
    schema: object,
    data: unknown
  ): void {
    const validate = this.ajv.compile(schema);

    const isValid = validate(data);

    if (!isValid) {
      const errors = this.formatErrors(
        validate.errors ?? []
      );

      throw new Error(
        `Falha na validação de contrato:\n${errors}`
      );
    }
  }

  private static formatErrors(
    errors: ErrorObject[]
  ): string {
    return errors
      .map((error) => {
        return `${error.instancePath || "/"} ${error.message}`;
      })
      .join("\n");
  }
}
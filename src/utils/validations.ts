import { validate, ValidationError } from "class-validator";
import { plainToInstance } from "class-transformer";
import { GraphQLError } from "graphql";

export async function validateDto<T extends object>(
  cls: new () => T,
  plain: Record<string, unknown>,
) {
  const instance = plainToInstance(cls, plain);
  const errors: ValidationError[] = await validate(instance);

  if (errors.length > 0) {
    const validationErrors = errors.map((error) => ({
      field: error.property,
      message: error.constraints
        ? Object.values(error.constraints).join(", ")
        : "Invalid value",
      code: "VALIDATION_FAILED",
    }));

    throw new GraphQLError("Validation failed", {
      extensions: {
        code: "BAD_USER_INPUT",
        errors: validationErrors,
      },
    });
  }

  return instance;
}

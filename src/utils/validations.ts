import { validate } from "class-validator";
import { plainToInstance } from "class-transformer";
import { GraphQLError } from "graphql";

export async function validateDto<T extends object>(
  cls: new () => T,
  plain: Record<string, unknown>,
) {
  const instance = plainToInstance(cls, plain);
  const errors = await validate(instance);

  if (errors.length > 0) {
    const first = errors[0];
    const constraints = first.constraints
      ? Object.values(first.constraints).join(", ")
      : "Validation error";
    throw new GraphQLError(constraints, {
      extensions: { code: "BAD_USER_INPUT" },
    });
  }

  return instance;
}

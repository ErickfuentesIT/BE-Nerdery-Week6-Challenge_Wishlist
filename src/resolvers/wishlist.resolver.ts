import { GraphQLScalarType, Kind } from "graphql";
import { CreateItemDto } from "../dtos/items/create-item.dto";
import { UpdateItemDto } from "../dtos/items/update-item.dto";
import { GetItemDto } from "../dtos/items/get-item.dto";
import { WishlistService } from "../services/wishlist.service";
import { validateDto } from "../utils/validations";
export { typeDefs } from "../schemas/wishlist.schema";

// Help to avoid use ANY
type AddItemArgs = { input: Record<string, unknown> };
type UpdateItemArgs = { id: string; input: Record<string, unknown> };
type GetItemArgs = { id: string };
type GetItemsArgs = {
  page?: number;
  pageSize?: number;
  name?: string;
  sortByPrice?: "ASC" | "DESC";
};

export const resolvers = {
  DateTime: new GraphQLScalarType({
    name: "DateTime",
    description: "A date-time string in ISO 8601 format",
    serialize(value: unknown): string {
      if (value instanceof Date) {
        return value.toISOString();
      }
      if (typeof value === "string") {
        return new Date(value).toISOString();
      }
      throw new Error("DateTime cannot represent an invalid date-time value");
    },
    parseValue(value: unknown): Date {
      if (typeof value === "string") {
        const date = new Date(value);
        if (isNaN(date.getTime())) {
          throw new Error("DateTime cannot represent an invalid date-time value");
        }
        return date;
      }
      throw new Error("DateTime must be a string");
    },
    parseLiteral(ast): Date {
      if (ast.kind === Kind.STRING) {
        const date = new Date(ast.value);
        if (isNaN(date.getTime())) {
          throw new Error("DateTime cannot represent an invalid date-time value");
        }
        return date;
      }
      throw new Error("DateTime must be a string");
    },
  }),
  Query: {
    getItems(_: unknown, args: GetItemsArgs, ___: unknown) {
      return WishlistService.getItems(args);
    },
    async getItem(_: unknown, args: GetItemArgs, __: unknown) {
      const data = await validateDto(GetItemDto, args);
      return WishlistService.getItem(data.id);
    },
    getSummary(_: unknown, __: unknown, ___: unknown) {
      return WishlistService.getSummary();
    },
  },
  Mutation: {
    async addItem(_: unknown, args: AddItemArgs, __: unknown) {
      const validatedData = await validateDto(CreateItemDto, args.input);

      return WishlistService.addItem(validatedData);
    },
    async updateItem(_: unknown, args: UpdateItemArgs, __: unknown) {
      const validatedData = await validateDto(UpdateItemDto, args.input);
      const validateId = await validateDto(GetItemDto, { id: args.id });

      return WishlistService.updateItem(validateId.id, validatedData);
    },
    async deleteItem(_: unknown, args: GetItemArgs, __: unknown) {
      const validateData = await validateDto(GetItemDto, args);
      return WishlistService.deleteItem(validateData.id);
    },
  },
};

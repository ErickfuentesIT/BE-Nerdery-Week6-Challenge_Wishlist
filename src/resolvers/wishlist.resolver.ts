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

      return WishlistService.updateItem(args.id, validatedData);
    },
    async deleteItem(_: unknown, args: GetItemArgs, __: unknown) {
      const validateData = await validateDto(GetItemDto, args);
      return WishlistService.deleteItem(validateData.id);
    },
  },
};

import { CreateItemDto } from "../dtos/items/create-item.dto";
import { UpdateItemDto } from "../dtos/items/update-item.dto";
import { v4 as uuid } from "uuid";
import fs from "fs";
import path from "path";
import { TItem } from "../types/item";
import { GraphQLError } from "graphql";

// Initial Array in memory
let items: TItem[] = [];

type TSummary = {
  mostExpensiveItem: TItem;
  averagePriceCents: number;
  totalCostCents: number;
  totalItems: number;
};

type TGetItemsArgs = {
  page?: number;
  pageSize?: number;
  name?: string;
  sortByPrice?: "ASC" | "DESC";
};

type TPaginatedItems = {
  items: TItem[];
  totalCount: number;
  page: number;
  pageSize: number;
};

export class WishlistService {
  static addItem(newItem: CreateItemDto): TItem {
    const item: TItem = {
      id: uuid(),
      ...newItem,
      createdAt: new Date().toISOString(),
    };
    items.push(item);
    return item;
  }
  static getItems(args: TGetItemsArgs): TPaginatedItems {
    let result = [...items];

    // 1. Filter by name
    if (args.name) {
      const search = args.name.toLowerCase();
      result = result.filter((item) =>
        item.name.toLowerCase().includes(search),
      );
    }

    // 2. Sort by price
    if (args.sortByPrice) {
      result.sort((a, b) =>
        args.sortByPrice === "ASC" ? a.price - b.price : b.price - a.price,
      );
    }

    // 3. Pagination
    const page = args.page ?? 1;
    const pageSize = args.pageSize ?? 10;
    const totalCount = result.length;
    const start = (page - 1) * pageSize;
    result = result.slice(start, start + pageSize);

    return { items: result, totalCount, page, pageSize };
  }

  static getItem(itemId: string): TItem {
    const item = items.find((item) => item.id === itemId);
    if (!item) {
      throw new GraphQLError("Item not found", {
        extensions: { code: "NOT_FOUND" },
      });
    }

    return item;
  }

  static updateItem(id: string, data: UpdateItemDto): TItem {
    const item = items.find((item) => item.id === id);
    if (!item) {
      throw new GraphQLError("Item not found", {
        extensions: { code: "NOT_FOUND" },
      });
    }
    if (data.name !== undefined) item.name = String(data.name);
    if (data.price !== undefined) item.price = Number(data.price);
    if (data.store !== undefined) item.store = String(data.store);
    return item;
  }

  static deleteItem(itemId: string): boolean {
    const index = items.findIndex((item) => item.id === itemId);
    if (index === -1) {
      throw new GraphQLError("Item not found", {
        extensions: { code: "NOT_FOUND" },
      });
    }
    items.splice(index, 1);
    return true;
  }

  static getSummary(): TSummary {
    if (items.length === 0) {
      throw new GraphQLError("No items in wishlist", {
        extensions: { code: "NOT_FOUND" },
      });
    }
    const mostExpensiveItem = items.reduce(
      (max, item) => (item.price > max.price ? item : max),
      items[0],
    );
    const totalCostCents = items.reduce(
      (total, currentValue) => total + currentValue.price,
      0,
    );
    const totalItems = items.length;

    const averagePriceCents = totalCostCents / totalItems;

    return {
      mostExpensiveItem,
      averagePriceCents,
      totalCostCents,
      totalItems,
    };
  }

  static exportToCsv(): string {
    const csvContent = items.reduce((text, item) => {
      text += `"${item.id}","${item.name}","${item.price}","${item.store}","${item.createdAt}"\n`;
      return text;
    }, "id,name,price,store\n");

    const outputPath = path.resolve(
      __dirname,
      "..",
      "..",
      "src",
      "data",
      `wishlist-${Date.now()}.csv`,
    );

    fs.writeFileSync(outputPath, csvContent, "utf-8");

    console.log("File written successfully to ", outputPath);
    return outputPath;
  }
}

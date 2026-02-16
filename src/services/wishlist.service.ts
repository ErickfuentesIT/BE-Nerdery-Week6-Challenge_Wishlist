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
  totalCost: number;
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
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
};

export class WishlistService {
  static addItem(newItem: CreateItemDto): TItem {
    const item: TItem = {
      id: uuid(),
      ...newItem,
      addedAt: new Date().toISOString(),
    };
    items.push(item);
    return item;
  }
  static getItems(args: TGetItemsArgs): TPaginatedItems {
    const MAX_PAGE_SIZE = 100;
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
    const requestedPageSize = args.pageSize ?? 10;
    const pageSize = Math.min(requestedPageSize, MAX_PAGE_SIZE);
    const totalCount = result.length;
    const start = (page - 1) * pageSize;
    const totalPages = Math.ceil(totalCount / pageSize); // Calculate total pages
    const paginatedItems = result.slice(start, start + pageSize);

    return {
      items: paginatedItems,
      totalCount,
      page,
      pageSize,
      totalPages,
      hasNextPage: page < totalPages,
      hasPreviousPage: page > 1,
    };
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
      totalCost: totalCostCents,
      totalItems,
    };
  }

  static exportToCsv(): string {
    const header = "id,name,price,store,addedAt\n";

    const csvContent = items
      .map((item) => {
        const cleanName = item.name.replace(/"/g, '""');
        const cleanStore = item.store.replace(/"/g, '""');

        return `"${item.id}","${cleanName}","${item.price}","${cleanStore}","${item.addedAt}"`;
      })
      .join("\n");

    return header + csvContent;
  }
}

# Wishlist GraphQL API

A GraphQL API built with Express and Apollo Server for managing a wishlist of items. Data is stored in memory.

## Tech Stack

- Node.js
- TypeScript
- Express 5
- Apollo Server 4
- class-validator / class-transformer

## Getting Started

### Prerequisites

- Node.js >= 18

### Installation

```bash
npm install
```

### Run the server

```bash
npm run dev
```

The server will start at `http://localhost:4000`.

- GraphQL Playground: `http://localhost:4000/graphql`
- CSV Export: `GET http://localhost:4000/exports/csvs`

## Project Structure

```
src/
├── dtos/items/          # Validation DTOs (class-validator)
│   ├── create-item.dto.ts
│   ├── update-item.dto.ts
│   └── get-item.dto.ts
├── resolvers/           # GraphQL resolvers
│   └── wishlist.resolver.ts
├── routes/              # Express REST routes
│   └── exports.route.ts
├── schemas/             # GraphQL type definitions
│   └── wishlist.schema.ts
├── services/            # Business logic
│   └── wishlist.service.ts
├── types/               # Shared TypeScript types
│   └── item.ts
├── utils/               # Utilities
│   └── validations.ts
└── server.ts            # App entry point
```

## GraphQL API

### Queries

| Query                                         | Description                                                 |
| --------------------------------------------- | ----------------------------------------------------------- |
| `getItems(page, pageSize, name, sortByPrice)` | Get paginated items with optional filters                   |
| `getItem(id)`                                 | Get a single item by ID                                     |
| `getSummary`                                  | Get wishlist summary (most expensive, average price, total) |

### Mutations

| Mutation                | Description             |
| ----------------------- | ----------------------- |
| `addItem(input)`        | Add a new item          |
| `updateItem(id, input)` | Update an existing item |
| `deleteItem(id)`        | Delete an item by ID    |

### Example Queries

**Add an item:**

```graphql
mutation {
  addItem(input: { name: "Keyboard", price: 75, store: "Amazon" }) {
    id
    name
    price
    store
  }
}
```

**Get paginated items sorted by price:**

```graphql
query {
  getItems(page: 1, pageSize: 5, sortByPrice: DESC) {
    items {
      id
      name
      price
      store
    }
    totalCount
    page
    pageSize
  }
}
```

**Get summary:**

```graphql
query {
  getSummary {
    mostExpensiveItem {
      name
      price
    }
    averagePriceCents
    totalCostCents
    totalItems
  }
}
```

## REST Endpoints

| Method | Path            | Description                   |
| ------ | --------------- | ----------------------------- |
| GET    | `/exports/csvs` | Download wishlist as CSV file |

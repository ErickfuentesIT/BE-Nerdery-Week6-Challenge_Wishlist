export const typeDefs = `#graphql
  type Item {
    id: ID!
    name: String!
    price: Int!
    store: String!
    createdAt: String!
  }

  type Summary {
    mostExpensiveItem: Item!
    averagePriceCents: Int!
    totalCostCents: Int!
    totalItems: Int!
  }

  input AddItemInput {
    name: String!
    price: Int!
    store: String!
  }

  input UpdateItemInput {
    name: String
    price: Int
    store: String
  }

  enum SortOrder{
    ASC
    DESC
  }

 type PaginatedItems {
    items: [Item!]!
    totalCount: Int!
    page: Int!
    pageSize: Int!
 }

  type Query {
    getItems (page: Int, pageSize: Int, name: String, sortByPrice: SortOrder): PaginatedItems!
    getItem(id: ID!): Item
    getSummary: Summary
  }

  type Mutation {
    addItem(input: AddItemInput!): Item!
    updateItem(id: ID!, input: UpdateItemInput!): Item
    deleteItem(id: ID!): Boolean!
  }
`;

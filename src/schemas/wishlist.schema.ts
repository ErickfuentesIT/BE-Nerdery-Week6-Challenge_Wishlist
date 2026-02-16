export const typeDefs = `#graphql

  scalar DateTime

  """
  Represents a single product in the user's wishlist.
  """
  type Item {
    "Unique identifier for the item (UUID)."
    id: ID!
    "The display name of the product."
    name: String!
    "The cost of the item."
    price: Int!
    "The name of the retailer or shop where the item is sold."
    store: String!
    "The timestamp indicating when the item was added to the list."
    addedAt: DateTime!
  }

  """
  A structured error response for mutation failures.
  """
  type MutationError {
    "A machine-readable error code (e.g., 'NOT_FOUND')."
    code: String!    
    "A human-readable explanation of what went wrong."
    message: String! 
    "The specific input field that caused the validation error, if applicable."
    field: String    
  }

  """
  Response payload for updating an existing item.
  """
  type UpdateItemPayload {
    "The updated item, or null if the update failed."
    item: Item
    "A list of errors explaining why the update could not be completed."
    errors: [MutationError!]
  }

  """
  Response payload for deleting an item.
  """
  type DeleteItemPayload {
    "Indicates if the deletion was successful."
    success: Boolean!
    "A list of errors if the item could not be deleted (e.g., item not found)."
    errors: [MutationError!]
  }

  """
  A high-level overview of the entire wishlist's financial data.
  """
  type Summary {
    "The single item with the highest price tag."
    mostExpensiveItem: Item!
    "The average cost of all items in the list, in cents."
    averagePriceCents: Int!
    "The sum of all item prices."
    totalCost: Float!
    "The total count of items in the wishlist."
    totalItems: Int!
  }

  """
  Data required to create a new wishlist item.
  """
  input AddItemInput {
    name: String!
    "Price in cents."
    price: Int!
    store: String!
  }

  """
  Fields available for partial updates on an item.
  """
  input UpdateItemInput {
    name: String
    price: Int
    store: String
  }

  """
  Options for sorting list results.
  """
  enum SortOrder {
    "Smallest to largest."
    ASC
    "Largest to smallest."
    DESC
  }

  """
  A paginated response containing a subset of items and metadata.
  """
  type PaginatedItems {
    "The list of items for the current page."
    items: [Item!]!
    "Total number of items matching the filter across all pages."
    totalCount: Int!
    "The current page number (starting at 1)."
    page: Int!
    "The number of items requested per page."
    pageSize: Int!
    "True if there is at least one more page of data."
    hasNextPage: Boolean!
    "True if the current page is not the first page."
    hasPreviousPage: Boolean!
    "The total number of pages based on the pageSize."
    totalPages: Int!
  }

  type Query {
    "Retrieves a filtered and paginated list of items."
    getItems (
      page: Int, 
      pageSize: Int, 
      name: String, 
      "Sort items by price."
      sortByPrice: SortOrder
    ): PaginatedItems!

    "Finds a specific item by its unique ID."
    getItem(id: ID!): Item

    "Calculates financial statistics for the entire wishlist."
    getSummary: Summary
  }

  type Mutation {
    "Adds a new item to the wishlist."
    addItem(input: AddItemInput!): Item!

    "Updates an existing item's details. Returns a payload with error handling."
    updateItem(id: ID!, input: UpdateItemInput!): UpdateItemPayload!

    "Removes an item from the wishlist."
    deleteItem(id: ID!): DeleteItemPayload!
  }
`;
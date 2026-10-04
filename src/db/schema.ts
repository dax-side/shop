import { relations } from "drizzle-orm";
import {
  boolean,
  index,
  integer,
  jsonb,
  pgEnum,
  pgTable,
  primaryKey,
  serial,
  text,
  timestamp,
  uniqueIndex,
  uuid,
} from "drizzle-orm/pg-core";
import type { Finish, Product } from "../lib/catalogue";

export const roomEnum = pgEnum("room", ["kitchen", "table", "bath-linen", "tools", "paper-desk"]);
export const fulfilmentEnum = pgEnum("fulfilment", ["delivery", "pickup"]);
export const paymentMethodEnum = pgEnum("payment_method", ["card", "bank-transfer", "ussd"]);
// Which client last added an item: the website or the mobile app.
export const clientEnum = pgEnum("client", ["web", "app"]);
export const orderStatusEnum = pgEnum("order_status", [
  "pending_payment",
  "paid",
  "packed",
  "dispatched",
  "completed",
  "cancelled",
]);

export const products = pgTable("products", {
  id: serial("id").primaryKey(),
  slug: text("slug").notNull().unique(),
  number: text("number").notNull().unique(),
  name: text("name").notNull(),
  room: roomEnum("room").notNull(),
  material: text("material").notNull(),
  tagline: text("tagline").notNull(),
  description: text("description").notNull(),
  price: integer("price").notNull(),
  isNew: boolean("is_new").notNull().default(false),
  tone: text("tone").notNull(),
  finishes: jsonb("finishes").$type<Finish[]>().notNull().default([]),
  details: jsonb("details").$type<Product["details"]>().notNull(),
  active: boolean("active").notNull().default(true),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

// Auth.js tables. Property names follow what the Drizzle adapter expects.
export const users = pgTable("users", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  name: text("name"),
  email: text("email").unique(),
  emailVerified: timestamp("email_verified", { mode: "date", withTimezone: true }),
  image: text("image"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export const accounts = pgTable(
  "accounts",
  {
    userId: text("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    type: text("type").notNull(),
    provider: text("provider").notNull(),
    providerAccountId: text("provider_account_id").notNull(),
    refresh_token: text("refresh_token"),
    access_token: text("access_token"),
    expires_at: integer("expires_at"),
    token_type: text("token_type"),
    scope: text("scope"),
    id_token: text("id_token"),
    session_state: text("session_state"),
  },
  (account) => [primaryKey({ columns: [account.provider, account.providerAccountId] })],
);

export const sessions = pgTable("sessions", {
  sessionToken: text("session_token").primaryKey(),
  userId: text("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  expires: timestamp("expires", { mode: "date", withTimezone: true }).notNull(),
  // Shown on the account screen as "Signed in on". Auth.js leaves these to their defaults.
  client: clientEnum("client").notNull().default("web"),
  device: text("device"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  lastSeenAt: timestamp("last_seen_at", { withTimezone: true }).notNull().defaultNow(),
});

// One-time codes for handing a website sign-in to the app (PKCE), or the app's session to the
// website (checkout). Only a SHA-256 hash of each code is stored.
export const handoffPurposeEnum = pgEnum("handoff_purpose", ["app_sign_in", "web_session"]);
export const handoffCodes = pgTable("handoff_codes", {
  codeHash: text("code_hash").primaryKey(),
  purpose: handoffPurposeEnum("purpose").notNull(),
  userId: text("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  codeChallenge: text("code_challenge"),
  redirectUri: text("redirect_uri"),
  expiresAt: timestamp("expires_at", { withTimezone: true }).notNull(),
  usedAt: timestamp("used_at", { withTimezone: true }),
});

export const savedItems = pgTable(
  "saved_items",
  {
    userId: text("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    productId: integer("product_id")
      .notNull()
      .references(() => products.id, { onDelete: "cascade" }),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (saved) => [primaryKey({ columns: [saved.userId, saved.productId] })],
);

export const orders = pgTable("orders", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: text("user_id").references(() => users.id, { onDelete: "set null" }),
  reference: text("reference").notNull().unique(),
  status: orderStatusEnum("status").notNull().default("pending_payment"),
  email: text("email").notNull(),
  phone: text("phone").notNull(),
  firstName: text("first_name").notNull(),
  lastName: text("last_name").notNull(),
  method: fulfilmentEnum("method").notNull(),
  street: text("street"),
  landmark: text("landmark"),
  area: text("area"),
  state: text("state"),
  paymentMethod: paymentMethodEnum("payment_method").notNull(),
  // Paystack reference of the successful payment.
  paymentReference: text("payment_reference").unique(),
  paidAt: timestamp("paid_at", { withTimezone: true }),
  subtotal: integer("subtotal").notNull(),
  delivery: integer("delivery").notNull(),
  total: integer("total").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
}, (order) => [index("orders_user_id_idx").on(order.userId)]);

export const orderItems = pgTable("order_items", {
  id: serial("id").primaryKey(),
  orderId: uuid("order_id")
    .notNull()
    .references(() => orders.id, { onDelete: "cascade" }),
  productId: integer("product_id")
    .notNull()
    .references(() => products.id),
  // Snapshot of the product at the time of the order.
  name: text("name").notNull(),
  number: text("number").notNull(),
  tone: text("tone").notNull(),
  finish: text("finish"),
  unitPrice: integer("unit_price").notNull(),
  quantity: integer("quantity").notNull(),
  lineTotal: integer("line_total").notNull(),
});

// A signed-in user's bag, shared by the website and the app. `version` goes up on every change so
// clients can wait for the next change instead of re-fetching the whole cart.
export const carts = pgTable("carts", {
  userId: text("user_id")
    .primaryKey()
    .references(() => users.id, { onDelete: "cascade" }),
  version: integer("version").notNull().default(0),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
});

export const cartItems = pgTable(
  "cart_items",
  {
    id: serial("id").primaryKey(),
    userId: text("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    productId: integer("product_id")
      .notNull()
      .references(() => products.id, { onDelete: "cascade" }),
    // Empty string when the product has no finishes, so the unique index treats it as a value.
    finish: text("finish").notNull().default(""),
    quantity: integer("quantity").notNull(),
    // Client and time of the most recent add, for "Added on website · just now".
    addedFrom: clientEnum("added_from").notNull(),
    addedAt: timestamp("added_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (item) => [uniqueIndex("cart_items_user_product_finish_idx").on(item.userId, item.productId, item.finish)],
);

export const subscribers = pgTable("subscribers", {
  id: serial("id").primaryKey(),
  email: text("email").notNull().unique(),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export const ordersRelations = relations(orders, ({ many }) => ({
  items: many(orderItems),
}));

export const orderItemsRelations = relations(orderItems, ({ one }) => ({
  order: one(orders, { fields: [orderItems.orderId], references: [orders.id] }),
  product: one(products, { fields: [orderItems.productId], references: [products.id] }),
}));

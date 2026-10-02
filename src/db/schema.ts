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
  uuid,
} from "drizzle-orm/pg-core";
import type { Finish, Product } from "../lib/catalogue";

export const roomEnum = pgEnum("room", ["kitchen", "table", "bath-linen", "tools", "paper-desk"]);
export const fulfilmentEnum = pgEnum("fulfilment", ["delivery", "pickup"]);
export const paymentMethodEnum = pgEnum("payment_method", ["card", "bank-transfer", "ussd"]);
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
});

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

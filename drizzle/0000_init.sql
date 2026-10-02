CREATE TYPE "public"."fulfilment" AS ENUM('delivery', 'pickup');--> statement-breakpoint
CREATE TYPE "public"."order_status" AS ENUM('pending_payment', 'paid', 'packed', 'dispatched', 'completed', 'cancelled');--> statement-breakpoint
CREATE TYPE "public"."payment_method" AS ENUM('card', 'bank-transfer', 'ussd');--> statement-breakpoint
CREATE TYPE "public"."room" AS ENUM('kitchen', 'table', 'bath-linen', 'tools', 'paper-desk');--> statement-breakpoint
CREATE TABLE "order_items" (
	"id" serial PRIMARY KEY NOT NULL,
	"order_id" uuid NOT NULL,
	"product_id" integer NOT NULL,
	"name" text NOT NULL,
	"number" text NOT NULL,
	"tone" text NOT NULL,
	"finish" text,
	"unit_price" integer NOT NULL,
	"quantity" integer NOT NULL,
	"line_total" integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE "orders" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"reference" text NOT NULL,
	"status" "order_status" DEFAULT 'pending_payment' NOT NULL,
	"email" text NOT NULL,
	"phone" text NOT NULL,
	"first_name" text NOT NULL,
	"last_name" text NOT NULL,
	"method" "fulfilment" NOT NULL,
	"street" text,
	"landmark" text,
	"area" text,
	"state" text,
	"payment_method" "payment_method" NOT NULL,
	"subtotal" integer NOT NULL,
	"delivery" integer NOT NULL,
	"total" integer NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "orders_reference_unique" UNIQUE("reference")
);
--> statement-breakpoint
CREATE TABLE "products" (
	"id" serial PRIMARY KEY NOT NULL,
	"slug" text NOT NULL,
	"number" text NOT NULL,
	"name" text NOT NULL,
	"room" "room" NOT NULL,
	"material" text NOT NULL,
	"tagline" text NOT NULL,
	"description" text NOT NULL,
	"price" integer NOT NULL,
	"is_new" boolean DEFAULT false NOT NULL,
	"tone" text NOT NULL,
	"finishes" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"details" jsonb NOT NULL,
	"active" boolean DEFAULT true NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "products_slug_unique" UNIQUE("slug"),
	CONSTRAINT "products_number_unique" UNIQUE("number")
);
--> statement-breakpoint
CREATE TABLE "subscribers" (
	"id" serial PRIMARY KEY NOT NULL,
	"email" text NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "subscribers_email_unique" UNIQUE("email")
);
--> statement-breakpoint
ALTER TABLE "order_items" ADD CONSTRAINT "order_items_order_id_orders_id_fk" FOREIGN KEY ("order_id") REFERENCES "public"."orders"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "order_items" ADD CONSTRAINT "order_items_product_id_products_id_fk" FOREIGN KEY ("product_id") REFERENCES "public"."products"("id") ON DELETE no action ON UPDATE no action;
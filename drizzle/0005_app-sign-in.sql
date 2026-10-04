CREATE TYPE "public"."handoff_purpose" AS ENUM('app_sign_in', 'web_session');--> statement-breakpoint
CREATE TABLE "handoff_codes" (
	"code_hash" text PRIMARY KEY NOT NULL,
	"purpose" "handoff_purpose" NOT NULL,
	"user_id" text NOT NULL,
	"code_challenge" text,
	"redirect_uri" text,
	"expires_at" timestamp with time zone NOT NULL,
	"used_at" timestamp with time zone
);
--> statement-breakpoint
CREATE TABLE "saved_items" (
	"user_id" text NOT NULL,
	"product_id" integer NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "saved_items_user_id_product_id_pk" PRIMARY KEY("user_id","product_id")
);
--> statement-breakpoint
ALTER TABLE "sessions" ADD COLUMN "client" "client" DEFAULT 'web' NOT NULL;--> statement-breakpoint
ALTER TABLE "sessions" ADD COLUMN "device" text;--> statement-breakpoint
ALTER TABLE "sessions" ADD COLUMN "created_at" timestamp with time zone DEFAULT now() NOT NULL;--> statement-breakpoint
ALTER TABLE "sessions" ADD COLUMN "last_seen_at" timestamp with time zone DEFAULT now() NOT NULL;--> statement-breakpoint
ALTER TABLE "handoff_codes" ADD CONSTRAINT "handoff_codes_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "saved_items" ADD CONSTRAINT "saved_items_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "saved_items" ADD CONSTRAINT "saved_items_product_id_products_id_fk" FOREIGN KEY ("product_id") REFERENCES "public"."products"("id") ON DELETE cascade ON UPDATE no action;
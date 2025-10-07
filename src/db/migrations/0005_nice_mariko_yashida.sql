CREATE TABLE "products" (
	"id" serial NOT NULL,
	"name" varchar(180) NOT NULL,
	"image" varchar(255) NOT NULL,
	"images" varchar(255)[] NOT NULL,
	"description" text NOT NULL,
	"discount_price" numeric(12, 2) DEFAULT '0' NOT NULL,
	"price" numeric(12, 2) DEFAULT '0' NOT NULL,
	"rating" numeric(2, 1) DEFAULT '0' NOT NULL,
	"sold" integer DEFAULT 0 NOT NULL,
	"stock" integer DEFAULT 0 NOT NULL,
	"category_id" integer NOT NULL,
	"brand_id" integer NOT NULL,
	"created_at" timestamp with time zone DEFAULT now(),
	"updated_at" timestamp with time zone DEFAULT now(),
	CONSTRAINT "products_id_pk" PRIMARY KEY("id")
);
--> statement-breakpoint
ALTER TABLE "products" ADD CONSTRAINT "products_category_id_categories_id_fk" FOREIGN KEY ("category_id") REFERENCES "public"."categories"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "products" ADD CONSTRAINT "products_brand_id_brands_id_fk" FOREIGN KEY ("brand_id") REFERENCES "public"."brands"("id") ON DELETE cascade ON UPDATE no action;
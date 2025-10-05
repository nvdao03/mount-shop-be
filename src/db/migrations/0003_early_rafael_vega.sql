CREATE TABLE "brands" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar(180) NOT NULL,
	"image" varchar(255) NOT NULL,
	"created_at" timestamp with time zone DEFAULT now(),
	"updated_at" timestamp with time zone DEFAULT now(),
	CONSTRAINT "brands_name_unique" UNIQUE("name")
);
--> statement-breakpoint
CREATE TABLE "brands_categories" (
	"id" serial NOT NULL,
	"brand_id" integer,
	"category_id" integer,
	"created_at" timestamp with time zone DEFAULT now(),
	"updated_at" timestamp with time zone DEFAULT now(),
	CONSTRAINT "brands_categories_brand_id_category_id_pk" PRIMARY KEY("brand_id","category_id"),
	CONSTRAINT "brands_categories_id_unique" UNIQUE("id")
);
--> statement-breakpoint
CREATE TABLE "caregories" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar(180) NOT NULL,
	"image" varchar(255) NOT NULL,
	"created_at" timestamp with time zone DEFAULT now(),
	"updated_at" timestamp with time zone DEFAULT now(),
	CONSTRAINT "caregories_name_unique" UNIQUE("name")
);
--> statement-breakpoint
ALTER TABLE "brands_categories" ADD CONSTRAINT "brands_categories_brand_id_brands_id_fk" FOREIGN KEY ("brand_id") REFERENCES "public"."brands"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "brands_categories" ADD CONSTRAINT "brands_categories_category_id_caregories_id_fk" FOREIGN KEY ("category_id") REFERENCES "public"."caregories"("id") ON DELETE cascade ON UPDATE no action;
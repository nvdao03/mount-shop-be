ALTER TABLE "caregories" RENAME TO "categories";--> statement-breakpoint
ALTER TABLE "brands_categories" DROP CONSTRAINT "brands_categories_id_unique";--> statement-breakpoint
ALTER TABLE "categories" DROP CONSTRAINT "caregories_name_unique";--> statement-breakpoint
ALTER TABLE "brands_categories" DROP CONSTRAINT "brands_categories_category_id_caregories_id_fk";
--> statement-breakpoint
ALTER TABLE "brands_categories" ADD CONSTRAINT "brands_categories_category_id_categories_id_fk" FOREIGN KEY ("category_id") REFERENCES "public"."categories"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "brands_categories" DROP COLUMN "id";--> statement-breakpoint
ALTER TABLE "categories" ADD CONSTRAINT "categories_name_unique" UNIQUE("name");
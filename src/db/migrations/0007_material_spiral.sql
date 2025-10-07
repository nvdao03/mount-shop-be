ALTER TABLE "products" ALTER COLUMN "rating" SET DATA TYPE numeric(2, 1);--> statement-breakpoint
ALTER TABLE "products" ALTER COLUMN "rating" SET DEFAULT '0';
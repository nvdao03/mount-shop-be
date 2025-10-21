import { InferModel } from 'drizzle-orm'
import { numeric } from 'drizzle-orm/pg-core'
import { boolean } from 'drizzle-orm/pg-core'
import { text } from 'drizzle-orm/pg-core'
import { primaryKey } from 'drizzle-orm/pg-core'
import { timestamp } from 'drizzle-orm/pg-core'
import { serial, pgEnum, varchar, pgTable, integer } from 'drizzle-orm/pg-core'

// --- Enum ---
export const verifyEnum = pgEnum('verify_status', ['0', '1'])

// --- Tables ---
export const roles = pgTable('roles', {
  id: serial('id').primaryKey(),
  name: varchar('name', { length: 180 }).notNull().unique(),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow()
})

export const users = pgTable('users', {
  id: serial('id').primaryKey(),
  email: varchar('email', { length: 180 }).notNull().unique(),
  password: varchar('password', { length: 180 }).notNull(),
  role_id: integer('role_id')
    .notNull()
    .references(() => roles.id, { onDelete: 'restrict' }),
  avatar: varchar('avatar', { length: 255 }),
  verify: verifyEnum('verify').default('0').notNull(),
  email_verify_token: varchar('email_verify_token', { length: 255 }),
  forgot_password_token: varchar('forgot_password_token', { length: 255 }),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow()
})

export const refresh_tokens = pgTable('refresh_tokens', {
  id: serial('id').primaryKey(),
  token: varchar('token', { length: 255 }).notNull().unique(),
  user_id: integer('user_id')
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' }),
  iat: timestamp('iat', { withTimezone: true }).notNull(),
  exp: timestamp('exp', { withTimezone: true }).notNull(),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow()
})

export const categories = pgTable('categories', {
  id: serial('id').primaryKey(),
  name: varchar('name', { length: 180 }).notNull().unique(),
  image: varchar('image', { length: 255 }).notNull(),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow()
})

export const brands = pgTable('brands', {
  id: serial('id').primaryKey(),
  name: varchar('name', { length: 180 }).notNull().unique(),
  image: varchar('image', { length: 255 }).notNull(),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow()
})

export const brands_categories = pgTable(
  'brands_categories',
  {
    brand_id: integer('brand_id').references(() => brands.id, { onDelete: 'cascade' }),
    category_id: integer('category_id').references(() => categories.id, { onDelete: 'cascade' }),
    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
    updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow()
  },
  (table) => ({
    pk: primaryKey({ columns: [table.brand_id, table.category_id] })
  })
)

export const products = pgTable(
  'products',
  {
    id: serial('id'),
    name: varchar('name', { length: 180 }).notNull(),
    image: varchar('image', { length: 255 }).notNull(),
    images: varchar('images', { length: 255 }).array().notNull(),
    description: text('description').notNull(),
    price_before_discount: integer('price_before_discount').default(0).notNull(),
    price: integer('price').default(0).notNull(),
    rating: numeric('rating', { precision: 2, scale: 1 }).default('0').notNull(),
    sold: integer('sold').default(0).notNull(),
    stock: integer('stock').default(0).notNull(),
    category_id: integer('category_id')
      .notNull()
      .references(() => categories.id, { onDelete: 'cascade' }),
    brand_id: integer('brand_id')
      .notNull()
      .references(() => brands.id, { onDelete: 'cascade' }),
    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
    updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow()
  },
  (table) => ({
    pk: primaryKey({ columns: [table.id] })
  })
)

export const addresses = pgTable('addresses', {
  id: serial('id').primaryKey(),
  address: varchar('address', { length: 255 }),
  phone: varchar('phone', { length: 20 }),
  full_name: varchar('full_name', { length: 180 }).notNull(),
  user_id: integer('user_id')
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' }),
  is_default: boolean('is_default').default(false).notNull(),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow()
})

export const comments = pgTable('comments', {
  id: serial('id').primaryKey(),
  content: varchar('content', { length: 255 }).notNull(),
  product_id: integer('product_id').references(() => products.id, { onDelete: 'cascade' }),
  user_id: integer('user_id').references(() => users.id, { onDelete: 'cascade' }),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow()
})

// --- Types ---
export type Role = InferModel<typeof roles>
export type User = InferModel<typeof users>
export type RefreshToken = InferModel<typeof refresh_tokens>
export type Categories = InferModel<typeof categories>
export type Brands = InferModel<typeof brands>
export type BrandsCategories = InferModel<typeof brands_categories>
export type Products = InferModel<typeof products>
export type Addresses = InferModel<typeof addresses>

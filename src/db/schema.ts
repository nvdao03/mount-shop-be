import { InferModel } from 'drizzle-orm'
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
  full_name: varchar('full_name', { length: 180 }).notNull(),
  email: varchar('email', { length: 180 }).notNull().unique(),
  password: varchar('password', { length: 180 }).notNull(),
  role_id: integer('role_id')
    .notNull()
    .references(() => roles.id, { onDelete: 'restrict' }),
  phone: varchar('phone', { length: 20 }),
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

export const categories = pgTable('caregories', {
  id: serial('id').primaryKey(),
  name: varchar('name', { length: 180 }).notNull().unique(),
  image: varchar('image', { length: 255 }).notNull(),
  createAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow()
})

export const brands = pgTable('brands', {
  id: serial('id').primaryKey(),
  name: varchar('name', { length: 180 }).notNull().unique(),
  image: varchar('image', { length: 255 }).notNull(),
  createAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow()
})

export const brands_categories = pgTable(
  'brands_categories',
  {
    id: serial('id').unique().notNull(),
    brand_id: integer('brand_id').references(() => brands.id, { onDelete: 'cascade' }),
    category_id: integer('category_id').references(() => categories.id, { onDelete: 'cascade' }),
    createAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
    updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow()
  },
  (table) => ({
    pk: primaryKey({ columns: [table.brand_id, table.category_id] })
  })
)

// --- Types ---
export type Role = InferModel<typeof roles>
export type User = InferModel<typeof users>
export type RefreshToken = InferModel<typeof refresh_tokens>
export type Categories = InferModel<typeof categories>
export type Brands = InferModel<typeof brands>
export type BrandsCategories = InferModel<typeof brands_categories>

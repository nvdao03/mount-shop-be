import { InferModel } from 'drizzle-orm'
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

// --- Types ---
export type User = InferModel<typeof users>

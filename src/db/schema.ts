import { timestamp } from 'drizzle-orm/pg-core'
import { serial, pgEnum, varchar, pgTable, integer, date } from 'drizzle-orm/pg-core'

// --- Enum ---
export const verifyEnum = pgEnum('verify_status', ['0', '1'])

// --- Tables ---
export const roles = pgTable('roles', {
  id: serial('id').primaryKey(),
  name: varchar('name', { length: 180 }).notNull().unique(),
  createdAt: timestamp('created_at', { mode: 'date' }).defaultNow(),
  updatedAt: timestamp('updated_at', { mode: 'date' }).defaultNow()
})

export const users = pgTable('users', {
  id: serial('id').primaryKey(),
  fullName: varchar('full_name', { length: 180 }).notNull(),
  email: varchar('email', { length: 180 }).notNull().unique(),
  password: varchar('password', { length: 180 }).notNull(),
  roleId: integer('role_id')
    .notNull()
    .references(() => roles.id, { onDelete: 'restrict' }),
  phone: varchar('phone', { length: 20 }),
  avatar: varchar('avatar', { length: 255 }),
  verify: verifyEnum('verify').default('0').notNull(),
  emailVerifyToken: varchar('email_verify_token', { length: 255 }),
  forgotPasswordToken: varchar('forgot_password_token', { length: 255 }),
  createdAt: timestamp('created_at', { mode: 'date' }).defaultNow(),
  updatedAt: timestamp('updated_at', { mode: 'date' }).defaultNow()
})

export const refresh_tokens = pgTable('refresh_tokens', {
  id: serial('id').primaryKey(),
  token: varchar('token', { length: 255 }).notNull().unique(),
  userId: integer('user_id')
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' }),
  iat: timestamp('iat', { mode: 'date' }).notNull(),
  exp: timestamp('exp', { mode: 'date' }).notNull(),
  createdAt: timestamp('created_at', { mode: 'date' }).defaultNow(),
  updatedAt: timestamp('updated_at', { mode: 'date' }).defaultNow()
})

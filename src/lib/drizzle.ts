// eslint rule disabled because I don't like res squigly lines
/* eslint-disable @typescript-eslint/no-unused-vars */

import { type InferSelectModel, type InferInsertModel, sql } from "drizzle-orm";

import {
	blob,
	sqliteTable,
	text,
	real,
	numeric,
	integer,
	foreignKey,
} from "drizzle-orm/sqlite-core";
import { monotonic_ulid } from "./utils";

/* eslint-enable @typescript-eslint/no-unused-vars */

export type Ulid = string;

export const userTable = sqliteTable("users", {
	/**
	 * User's Unique ID, assigned by the server, should be a ULID and must not ever change
	 */
	id: text("id", { mode: "text" })
		.primaryKey()
		.$type<Ulid>()
		.$defaultFn(monotonic_ulid),

	/**
	 * User's display name, this can be used for lookup and can allow a different name to be shown from the username
	 *
	 * If `null` should display {@link userTable.username | `username`}
	 */
	display_name: text("display_name"),

	/**
	 * User's Username, can be changed at any time by the user.
	 */
	username: text("username", { mode: "text" }).notNull().unique(),

	/**
	 * User profile picture Asset ID
	 */
	profile_picture: text("profile_picture").references(
		() => publicAssetTable.id,
	),
});

export type UserSelectModel = InferSelectModel<typeof userTable>;
export type UserInsertModel = InferInsertModel<typeof userTable>;

export const userAliasTable = sqliteTable("user_aliases", {
	/**
	 * Alias ID, autoincrementing to keep track of alias count.
	 */
	id: integer("id").primaryKey({ autoIncrement: true }),

	/**
	 * User ID, that this alias record will point to
	 */
	user_ref: text("user_ref", { mode: "text" })
		.notNull()
		.$type<Ulid>()
		.references(() => userTable.id, { onDelete: "cascade" }),

	/**
	 * Username that this alias points so, helps prevent phishing by having all previous usernames of a user remain cached until the user's account is deleted.
	 */
	alias_name: text("alias_name", { mode: "text" }).notNull(),
});

export type UserAliasSelectModel = InferSelectModel<typeof userAliasTable>;
export type UserAliasInsertModel = InferInsertModel<typeof userAliasTable>;

export const emailAddressesTable = sqliteTable("email_addresses", {
	/**
	 * ID of the email address, user can have multiple email addresses.
	 *
	 * And email addresses can be assigned to many users (although requiring validation)
	 */
	email_id: integer("email_id").primaryKey({ autoIncrement: true }),

	/**
	 * User's ID that this email record belongs to, since an email address can refer to
	 * multiple accounts, this is not marked as unique
	 */
	user_id: text("user_id", { mode: "text", length: 26 })
		.notNull()
		.$type<Ulid>()
		.references(() => userTable.id, { onDelete: "cascade" }),

	/**
	 * email adddress that is associated with this record.
	 */
	email_address: text("email_address", { mode: "text" }).notNull().unique(),

	/**
	 * whether not an email is verified
	 */
	is_verified: integer("is_verified", { mode: "boolean" })
		.notNull()
		.default(sql`0`),
});

export type EmailAddressesSelectModel = InferSelectModel<
	typeof emailAddressesTable
>;
export type EmailAddressesInsertModel = InferInsertModel<
	typeof emailAddressesTable
>;

export const passwordTable = sqliteTable("passwords", {
	/**
	 * User id this password belongs to.
	 */
	user_id: text("user_id", { mode: "text" })
		.primaryKey()
		.references(() => userTable.id, { onDelete: "cascade" }),
	/**
	 * Password Hash
	 *
	 * Should be hashed with argon2id
	 */
	password_hash: text("password_hash").notNull(),
});

export type PasswordSelectModel = InferSelectModel<typeof passwordTable>;
export type PasswordInsertModel = InferInsertModel<typeof passwordTable>;

/**
 * This is a table that allows us to do a quick and dirty user public assets api
 *
 * This is to be used for things like profile pictures, which are *public*
 */
export const publicAssetTable = sqliteTable("public_assets", {
	/**
	 * File ID of the public asset
	 */
	id: text("file_name").primaryKey().$defaultFn(monotonic_ulid),
	/**
	 * {@link https://mdn.io/mime-type | MIME Type } of this file, used when returning.
	 */
	type: text("type").notNull(),
	/**
	 * Blob of the file, this is the actual file to be stored
	 */
	blob: blob("blob", { mode: "buffer" }).notNull().$type<Uint8Array>(),
});

export type PublicAssetSelectModel = InferSelectModel<typeof publicAssetTable>;
export type PublicAssetInsertModel = InferInsertModel<typeof publicAssetTable>;

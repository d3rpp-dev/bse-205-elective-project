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

/* eslint-enable @typescript-eslint/no-unused-vars */

export type Ulid = string;

export const userTable = sqliteTable("users", {
	/**
	 * User's Unique ID, assigned by the server, should be a ULID and must not ever change
	 */
	id: text("id", { mode: "text" }).primaryKey().$type<Ulid>(),

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
});

export type UserSelectModel = InferSelectModel<typeof userTable>;
export type UserInsertModel = InferInsertModel<typeof userTable>;

export const userAliasTable = sqliteTable(
	"user_aliases",
	{
		/**
		 * Alias ID, autoincrementing to keep track of alias count.
		 */
		id: integer("id").primaryKey({ autoIncrement: true }),

		/**
		 * User ID, that this alias record will point to
		 */
		user_ref: text("user_ref", { mode: "text" }).notNull().$type<Ulid>(),

		/**
		 * Username that this alias points so, helps prevent phishing by having all previous usernames of a user remain cached until the user's account is deleted.
		 */
		alias_name: text("alias_name", { mode: "text" }).notNull(),
	},
	(table) => {
		return {
			aliasReferences: foreignKey({
				columns: [table.user_ref],
				foreignColumns: [userTable.id],
			}).onDelete("cascade"),
		};
	},
);

export type UserAliasSelectModel = InferSelectModel<typeof userAliasTable>;
export type UserAliasInsertModel = InferInsertModel<typeof userAliasTable>;

export const emailAddressesTable = sqliteTable(
	"email_addresses",
	{
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
		user_id: text("user_id", { mode: "text", length: 26 }).$type<Ulid>(),

		/**
		 * email adddress that is associated with this record.
		 */
		email_address: text("email_address", { mode: "text" })
			.notNull()
			.unique(),

		/**
		 * whether not an email is verified
		 */
		is_verified: integer("is_verified", { mode: "boolean" })
			.notNull()
			.default(sql`0`),
	},
	(table) => {
		return {
			userReference: foreignKey({
				columns: [table.user_id],
				foreignColumns: [userTable.id],
			}).onDelete("cascade"),
		};
	},
);

export type EmailAddressesSelectModel = InferSelectModel<
	typeof emailAddressesTable
>;
export type EmailAddressesInsertModel = InferInsertModel<
	typeof emailAddressesTable
>;

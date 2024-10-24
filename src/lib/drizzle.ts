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
	displayName: text("display_name"),

	/**
	 * User's Username, can be changed at any time by the user.
	 */
	username: text("username", { mode: "text" }).notNull().unique(),

	/**
	 * User profile picture Asset ID
	 *
	 * References: {@link publicAssetTable.id}
	 */
	profilePicture: text("profile_picture").references(
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
	 * User ID, that this alias record will point to.
	 *
	 * References: {@link userTable.id}
	 */
	userRef: text("user_ref", { mode: "text" })
		.notNull()
		.$type<Ulid>()
		.references(() => userTable.id, { onDelete: "cascade" }),

	/**
	 * Username that this alias points so, helps prevent phishing by
	 * having all previous usernames of a user remain cached until the
	 * user's account is deleted.
	 */
	aliasName: text("alias_name", { mode: "text" }).notNull(),
});

export type UserAliasSelectModel = InferSelectModel<typeof userAliasTable>;
export type UserAliasInsertModel = InferInsertModel<typeof userAliasTable>;

export const emailAddressesTable = sqliteTable("email_addresses", {
	/**
	 * ID of the email address, user can have multiple email addresses.
	 *
	 * And email addresses can be assigned to many users (although requiring validation)
	 */
	emailId: integer("email_id").primaryKey({ autoIncrement: true }),

	/**
	 * User's ID that this email record belongs to, since an email address can refer to
	 * multiple accounts, this is not marked as unique.
	 *
	 * References: {@link userTable.id}
	 */
	userId: text("user_id", { mode: "text", length: 26 })
		.notNull()
		.$type<Ulid>()
		.references(() => userTable.id, { onDelete: "cascade" }),

	/**
	 * email adddress that is associated with this record.
	 */
	emailAddress: text("email_address", { mode: "text" }).notNull().unique(),

	/**
	 * whether not an email is verified
	 */
	isVerified: integer("is_verified", { mode: "boolean" })
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
	 *
	 * References: {@link userTable.id}
	 */
	userId: text("user_id", { mode: "text" })
		.primaryKey()
		.references(() => userTable.id, { onDelete: "cascade" }),
	/**
	 * Password Hash
	 *
	 * Should be hashed with argon2id
	 */
	passwordHash: text("password_hash").notNull(),
});

export type PasswordSelectModel = InferSelectModel<typeof passwordTable>;
export type PasswordInsertModel = InferInsertModel<typeof passwordTable>;

export const sessionTable = sqliteTable("sessions", {
	/**
	 * the Session ID
	 */
	id: text("id", { mode: "text" }).notNull(),
	/**
	 * the User ID of this session
	 *
	 * References: {@link userTable.id}
	 */
	userId: text("user_id")
		.notNull()
		.references(() => userTable.id),
	/**
	 * Expiry timestamp of this session.
	 */
	expiresAt: integer("expires_at").notNull(),
});

export type SessionSelectModel = InferSelectModel<typeof sessionTable>;
export type SessionInsertModel = InferInsertModel<typeof sessionTable>;

export const oauthConnectionTable = sqliteTable("oauth_connections", {
	/**
	 * The type of oauth connection
	 *
	 * Since, we'll likely stay with just Github, it'll probably just be github
	 */
	type: text("type", { mode: "text" }).notNull().$type<"github">(),
	/**
	 * the identifier from the oauth provider (e.g. Github User ID)
	 */
	oauthIdentifier: text("oauth_identifier", { mode: "text" }).notNull(),
	/**
	 * the userId of this connection.
	 *
	 * References {@link userTable.id}
	 */
	userId: text("user_id", { mode: "text" })
		.notNull()
		.references(() => userTable.id),
});

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
	 * {@link https://mdn.io/mime-type | MIME Type} of this file, used when returning.
	 */
	type: text("type").notNull(),
	/**
	 * Blob of the file, this is the actual file to be stored
	 */
	blob: blob("blob", { mode: "buffer" }).notNull().$type<Uint8Array>(),
});

export type PublicAssetSelectModel = InferSelectModel<typeof publicAssetTable>;
export type PublicAssetInsertModel = InferInsertModel<typeof publicAssetTable>;

/**
 * Public Key table, this will store a list of public keys associated with a KID and it's owner.
 */
export const publicKeyTable = sqliteTable("public_keys", {
	/**
	 * KID of this key, in the type of a ULID
	 */
	kid: text("kid").primaryKey().$defaultFn(monotonic_ulid),
	/**
	 * the key blob itself
	 */
	key: blob("key").notNull().unique(),
	/**
	 * Owner of the key
	 *
	 * References: {@link userTable.id}
	 */
	keyOwner: text("key_owner")
		.notNull()
		.references(() => userTable.id, {
			onDelete: "cascade",
		}),
});

export type PublicKeySelectModel = InferSelectModel<typeof publicKeyTable>;
export type PublicKeyInsertModel = InferInsertModel<typeof publicKeyTable>;

/**
 * This stores the symettrical keys used to encrypt the actual files
 * there is one of these per shared file where the stored file is
 * encrypted with a user's public key.
 */
export const symmetricKeyTable = sqliteTable("symmetric_keys", {
	/**
	 * Key ID, since there can be multiple this is not unique
	 */
	kid: text("kid").notNull().$defaultFn(monotonic_ulid),
	/**
	 * the public key that this is associated with.
	 *
	 * References: {@link publicKeyTable.kid}
	 */
	publicKey: text("public_key")
		.notNull()
		.references(() => publicKeyTable.kid, {
			onDelete: "cascade",
		}),
	/**
	 * the Key itself, with the key as specificied in {@link symmetricKeysTable.publicKey | `publicKey`}
	 */
	key: blob("key").notNull(),
});

export type SymmetricKeySelectModel = InferSelectModel<
	typeof symmetricKeyTable
>;
export type SymmetricKeyInsertModel = InferInsertModel<
	typeof symmetricKeyTable
>;

/**
 * This stores the encrypted blobs, since there can be multiple pubkey
 * clones per blob, there will be no primary key, I love SQLite.
 */
export const encryptedBlobTable = sqliteTable("encrypted_blobs", {
	/**
	 * The symmetricKey used to encrypt this blob, this can also be
	 * used as a primary key since there's a strict 1 key per file.
	 *
	 * References {@link symmetricKeyTable.kid}
	 */
	kid: text("kid")
		.primaryKey()
		.references(() => symmetricKeyTable.kid, {
			onDelete: "cascade",
		}),
	/**
	 * Initialisation Vector
	 */
	iv: blob("iv").notNull(),
	/**
	 * Encrypted BLOB data
	 */
	blob: blob("blob").notNull(),
});

export type EncryptedBlobSelectModel = InferSelectModel<
	typeof encryptedBlobTable
>;
export type EncryptedBlobInsertModel = InferInsertModel<
	typeof encryptedBlobTable
>;

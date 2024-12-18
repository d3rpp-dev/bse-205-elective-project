CREATE TABLE `email_addresses` (
	`email_id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`user_id` text(26) NOT NULL,
	`email_address` text NOT NULL,
	`is_verified` integer DEFAULT 0 NOT NULL,
	FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE UNIQUE INDEX `email_addresses_email_address_unique` ON `email_addresses` (`email_address`);--> statement-breakpoint
CREATE TABLE `encrypted_blobs` (
	`kid` text PRIMARY KEY NOT NULL,
	`iv` blob NOT NULL,
	`blob` blob NOT NULL,
	FOREIGN KEY (`kid`) REFERENCES `symmetric_keys`(`kid`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `oauth_connections` (
	`type` text NOT NULL,
	`oauth_identifier` text NOT NULL,
	`user_id` text NOT NULL,
	`connection_user_name` text NOT NULL,
	FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `public_assets` (
	`file_name` text PRIMARY KEY NOT NULL,
	`type` text NOT NULL,
	`blob` blob NOT NULL
);
--> statement-breakpoint
CREATE TABLE `public_keys` (
	`kid` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`key` blob NOT NULL,
	`key_owner` text NOT NULL,
	FOREIGN KEY (`key_owner`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE UNIQUE INDEX `public_keys_key_unique` ON `public_keys` (`key`);--> statement-breakpoint
CREATE TABLE `reserved_kids` (
	`kid` text PRIMARY KEY NOT NULL,
	`user` text NOT NULL,
	FOREIGN KEY (`user`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `sessions` (
	`id` text NOT NULL,
	`user_id` text NOT NULL,
	`expires_at` integer NOT NULL,
	FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `symmetric_keys` (
	`kid` text NOT NULL,
	`public_key` text NOT NULL,
	`key` blob NOT NULL,
	FOREIGN KEY (`public_key`) REFERENCES `public_keys`(`kid`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `user_aliases` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`user_ref` text NOT NULL,
	`alias_name` text NOT NULL,
	`alias_timestamp` integer NOT NULL,
	FOREIGN KEY (`user_ref`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `users` (
	`id` text PRIMARY KEY NOT NULL,
	`display_name` text,
	`username` text NOT NULL,
	`profile_picture` text,
	FOREIGN KEY (`profile_picture`) REFERENCES `public_assets`(`file_name`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE UNIQUE INDEX `users_username_unique` ON `users` (`username`);
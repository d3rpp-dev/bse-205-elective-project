CREATE TABLE `email_addresses` (
	`email_id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`user_id` text(26) NOT NULL,
	`email_address` text NOT NULL,
	`is_verified` integer DEFAULT 0 NOT NULL,
	FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `passwords` (
	`user_id` text PRIMARY KEY NOT NULL,
	`password_hash` text NOT NULL,
	FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `public_assets` (
	`file_name` text PRIMARY KEY NOT NULL,
	`type` text NOT NULL,
	`blob` blob NOT NULL
);
--> statement-breakpoint
CREATE TABLE `user_aliases` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`user_ref` text NOT NULL,
	`alias_name` text NOT NULL,
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
CREATE UNIQUE INDEX `email_addresses_email_address_unique` ON `email_addresses` (`email_address`);--> statement-breakpoint
CREATE UNIQUE INDEX `users_username_unique` ON `users` (`username`);
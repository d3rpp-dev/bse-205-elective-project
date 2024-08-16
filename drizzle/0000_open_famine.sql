CREATE TABLE `email_addresses` (
	`email_id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`user_id` text(26),
	`email_address` text NOT NULL,
	`is_verified` integer DEFAULT 0 NOT NULL,
	FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE cascade
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
	`username` text NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `email_addresses_email_address_unique` ON `email_addresses` (`email_address`);--> statement-breakpoint
CREATE UNIQUE INDEX `users_username_unique` ON `users` (`username`);
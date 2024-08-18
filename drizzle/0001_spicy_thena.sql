CREATE TABLE `public_assets` (
	`file_name` text PRIMARY KEY NOT NULL,
	`type` text NOT NULL,
	`blob` blob NOT NULL
);

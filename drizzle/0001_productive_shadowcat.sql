PRAGMA foreign_keys=OFF;--> statement-breakpoint
CREATE TABLE `__new_encrypted_blobs` (
	`kid` text PRIMARY KEY NOT NULL,
	`state` text NOT NULL,
	`name` text NOT NULL,
	`owner` text NOT NULL,
	`iv` blob,
	`blob` blob,
	FOREIGN KEY (`kid`) REFERENCES `symmetric_keys`(`kid`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`owner`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
INSERT INTO `__new_encrypted_blobs`("kid", "state", "name", "owner", "iv", "blob") SELECT "kid", "state", "name", "owner", "iv", "blob" FROM `encrypted_blobs`;--> statement-breakpoint
DROP TABLE `encrypted_blobs`;--> statement-breakpoint
ALTER TABLE `__new_encrypted_blobs` RENAME TO `encrypted_blobs`;--> statement-breakpoint
PRAGMA foreign_keys=ON;
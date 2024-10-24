import z from "zod";
import type { toZod } from "tozod";

const RsaOtherPrimesInfoSchema: toZod<RsaOtherPrimesInfo> = z.object({
	d: z.string().optional(),
	r: z.string().optional(),
	t: z.string().optional(),
});

export const JsonWebKeySchema: toZod<JsonWebKey> = z.object({
	alg: z.string().optional(),
	crv: z.string().optional(),
	d: z.string().optional(),
	dp: z.string().optional(),
	dq: z.string().optional(),
	e: z.string().optional(),
	ext: z.boolean().optional(),
	k: z.string().optional(),
	key_ops: z.array(z.string()).optional(),
	kty: z.string().optional(),
	n: z.string().optional(),
	oth: z.array(RsaOtherPrimesInfoSchema).optional(),
	p: z.string().optional(),
	q: z.string().optional(),
	qi: z.string().optional(),
	use: z.string().optional(),
	x: z.string().optional(),
	y: z.string().optional(),
});

export const JailBirdExportedKeySchema = z.object({
	/**
	 * The KID in the format of a ULID
	 */
	kid: z.string().ulid(),
	/**
	 * Key Pair
	 */
	key: z.object({
		publicKey: JsonWebKeySchema,
		privateKey: JsonWebKeySchema,
	}),
});

export type JailBirdExportedKey = z.infer<typeof JailBirdExportedKeySchema>;

export interface JailBirdKey {
	kid: string;
	key: CryptoKey;
}

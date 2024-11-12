import { assert, type Equals } from "tsafe";
import z from "zod";

export const keyUsagesSchema = z.enum([
	"encrypt",
	"decrypt",
	"sign",
	"verify",
	"deriveKey",
	"deriveBits",
	"wrapKey",
	"unwrapKey",
]);
assert<Equals<z.infer<typeof keyUsagesSchema>, KeyUsage>>();

// I would add an assert here, but just complains
export const keyAlgSchema = z.union([
	z.object({
		name: z.enum(["RSASSA-PKCS1-v1_5", "RSA-PSS", "RSA-OAEP"]),
		hash: z.enum(["SHA-1", "SHA-256", "SHA-384", "SHA-512"]),
	}),
	z.object({
		name: z.enum(["ECDSA", "ECDH"]),
		namedCurve: z.enum(["P-256", "P-384", "P-521"]),
	}),
	z.object({
		name: z.literal("HMAC"),
		hash: z.enum(["SHA-1", "SHA-256", "SHA-384", "SHA-512"]),
		length: z.number().optional(),
	}),
	z.object({
		name: z.enum(["AES-CTR", "AES-CBC", "AES-GCM", "AES-KW"]),
	}),
	z.object({
		name: z.literal("PBKDF2"),
	}),
	z.object({
		name: z.literal("HKDF"),
	}),
	z.object({
		name: z.literal("Ed25519"),
	}),
	z.object({
		name: z.literal("X25519"),
	}),
]);

export const keySchema = z
	.object({
		name: z.string().min(4).max(50),
		kid: z.string().ulid(),
		usages: z.array(keyUsagesSchema),
		alg: keyAlgSchema,
		// I tried typing it last time,
		// didn't end well
		key: z.any(),
	})
	.required();

// the only difference between there is that key is either an imported cryptokey or a JWK
export type ImportedKey = Omit<z.infer<typeof keySchema>, "key"> & {
	key: CryptoKey;
};
export type ExportedKey = Omit<z.infer<typeof keySchema>, "key"> & {
	key: JsonWebKey;
};

type KeyPair<T> = {
	publicKey: T;
	privateKey: T;
};

export type ImportedKeyPair = KeyPair<ImportedKey>;
export type ExportedKeyPair = KeyPair<ExportedKey>;

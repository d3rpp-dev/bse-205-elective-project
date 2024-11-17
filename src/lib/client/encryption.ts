import type { ImportedKey } from "./key_format";

export const generate_symmetrical_key = async () => {
	const generated_key = await window.crypto.subtle.generateKey(
		{
			name: "AES-GCM",
			length: 256,
		} as AesKeyGenParams,
		true,
		["encrypt", "decrypt"],
	);

	return generated_key;
};

export const encrypt_blob = async (
	symkey: CryptoKey,
	iv: BufferSource,
	data: BufferSource,
): Promise<Uint8Array> => {
	const encrypted_blob = await window.crypto.subtle.encrypt(
		{
			name: "AES-GCM",
			iv,
		} as AesGcmParams,
		symkey,
		data,
	);

	return new Uint8Array(encrypted_blob);
};

export const decrypt_blob = async (
	symkey: CryptoKey,
	iv: BufferSource,
	enc_data: BufferSource,
): Promise<Uint8Array> => {
	const decrypted_blob = await window.crypto.subtle.decrypt(
		{
			name: "AES-GCM",
			iv,
		} as AesGcmParams,
		symkey,
		enc_data,
	);

	return new Uint8Array(decrypted_blob);
};

export const wrap_symmetrical_key = async (
	pubkey: ImportedKey,
	symkey: CryptoKey,
): Promise<Uint8Array> => {
	const wrapped = await window.crypto.subtle.wrapKey(
		"jwk",
		symkey,
		pubkey.key,
		{
			name: "RSA-OAEP",
		},
	);

	return new Uint8Array(wrapped);
};

export const unwrap_symmetrical_key = async (
	privkey: ImportedKey,
	symkey_blob: BufferSource,
): Promise<CryptoKey> => {
	const unwrapped = await window.crypto.subtle.unwrapKey(
		"jwk",
		symkey_blob,
		privkey.key,
		{
			name: "RSA-OAEP",
		},
		{
			name: "AES-GCM",
		},
		true,
		["encrypt", "decrypt"],
	);

	return unwrapped;
};

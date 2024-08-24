import { ulid } from "ulid";
import type { JailBirdKey } from "./crypto_key";

export * from "./errors";
import { InvalidKeyError } from "./errors";
import { getContext, setContext } from "svelte";

const private_key_usages: KeyUsage[] = ["decrypt", "unwrapKey"];

const public_key_usages: KeyUsage[] = ["wrapKey", "encrypt"];

const key_usages = [...private_key_usages, ...public_key_usages];

const runtime_client_context_key = "$$_theAmalgamation";

export const setRuntimeClientContext = (client: TheAmalgamation) => {
	setContext(runtime_client_context_key, client);
};

export const getRuntimeClientContext = () => {
	return getContext(runtime_client_context_key) as TheAmalgamation;
};

/**
 * Behold, the amalgamation, the client that does literally everything on the client.
 */
export class TheAmalgamation {
	private key_pairs: JailBirdKey[] = [];

	constructor() {}

	public initialise_from_localstorage = async () => {
		this.key_pairs = [];
		console.info("Initialising Runtime Client from Localhost");

		for (let i = 0; i < window.localStorage.length; i++) {
			const item_name = window.localStorage.key(i)!;
			if (item_name.startsWith("cached_key-")) {
				const cached_key_string =
					window.localStorage.getItem(item_name)!;
				const parsed_cached_key = JSON.parse(cached_key_string);

				const kid = item_name.replace("cached_key-", "");

				if (
					"publicKey" in parsed_cached_key &&
					typeof parsed_cached_key.publicKey === "object" &&
					"privateKey" in parsed_cached_key &&
					typeof parsed_cached_key.privateKey === "object"
				) {
					const decoded_key = await this.decode_key_pair(
						parsed_cached_key.publicKey,
						parsed_cached_key.privateKey,
					);

					this.add_key_pair_to_client(kid, decoded_key);
					console.info(`Imported Cached key of KID ${kid}`);
				} else {
					console.warn(`Cached key of KID ${kid} is invalid`);
				}
			}
		}
	};

	private get_key = (kid: string): JailBirdKey | undefined => {
		return this.key_pairs.find((val) => val.kid === kid);
	};

	public add_key_pair_to_client = async (kid: string, key: CryptoKeyPair) => {
		this.key_pairs.push({
			kid,
			key,
		});

		window.localStorage.setItem(
			`cached_key-${kid}`,
			JSON.stringify(await this.encode_key_pair(key)),
		);
	};

	private encode_key_pair = async (key: CryptoKeyPair) => {
		return {
			publicKey: await window.crypto.subtle.exportKey(
				"jwk",
				key.publicKey,
			),
			privateKey: await window.crypto.subtle.exportKey(
				"jwk",
				key.privateKey,
			),
		};
	};

	private decode_key_pair = async (
		public_key: object,
		private_key: object,
	): Promise<CryptoKeyPair> => {
		try {
			return {
				privateKey: await window.crypto.subtle.importKey(
					"jwk",
					private_key,
					{ name: "ECDSA", namedCurve: "P-521" },
					true,
					private_key_usages,
				),
				publicKey: await window.crypto.subtle.importKey(
					"jwk",
					public_key,
					{ name: "ECDSA", namedCurve: "P-521" },
					true,
					public_key_usages,
				),
			};
		} catch (e) {
			if (e instanceof TypeError || e instanceof SyntaxError) {
				// Invalid Keys
				throw new InvalidKeyError();
			} else {
				// Invalid Use of key usages
				throw new InvalidKeyError();
			}
		}
	};

	public export_key_for_download = async (
		kid: string,
	): Promise<string | undefined> => {
		const key = this.get_key(kid);
		if (!key) return undefined;

		return JSON.stringify({
			kid,
			...this.encode_key_pair(key.key),
		});
	};

	/**
	 * Import a Private Key from the user to be use for cryptography
	 *
	 * @param key_string the string uploaded by the user
	 *
	 * @throws InvalidKeyError
	 */
	public import_private_key = async (key_string: string): Promise<void> => {
		try {
			const deserialised_key: object = JSON.parse(key_string);

			if (
				"kid" in deserialised_key &&
				typeof deserialised_key.kid === "string" &&
				"publicKey" in deserialised_key &&
				typeof deserialised_key.publicKey === "object" &&
				"privateKey" in deserialised_key &&
				typeof deserialised_key.privateKey === "object"
			) {
				const kid = deserialised_key.kid as string;
				const public_key = deserialised_key.publicKey as JsonWebKey;
				const private_key = deserialised_key.privateKey as JsonWebKey;

				const decoded_key = await this.decode_key_pair(
					public_key,
					private_key,
				);
				if (!decoded_key) throw new InvalidKeyError();

				this.add_key_pair_to_client(kid, decoded_key);
			} else {
				throw new InvalidKeyError();
			}
		} catch (e) {
			if (e instanceof InvalidKeyError) throw e;
			else throw new InvalidKeyError();
		}
	};

	public generate_key_pair = async () => {
		const new_key_id = ulid();
		const key = await window.crypto.subtle.generateKey(
			{
				name: "ECDSA",
				namedCurve: "P-251",
			},
			true,
			key_usages,
		);

		this.add_key_pair_to_client(new_key_id, key);
		return new_key_id;
	};
}

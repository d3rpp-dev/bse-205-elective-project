export interface JailBirdKey {
	/**
	 * The KID in the format of a ULID
	 */
	kid: string;
	/**
	 * Private Key
	 */
	key: CryptoKeyPair;
}

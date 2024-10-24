export class InvalidKeyError extends Error {
	constructor(error: string = "Invalid Key") {
		super(error);
	}
}

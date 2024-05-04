import CustomError from "./customError";

export default class DuplicateEntryError extends CustomError {
    statusCode = 409;
    constructor() {
        super("Duplicate Entry");
        Object.setPrototypeOf(this, DuplicateEntryError.prototype);
    }
    serialize(): { message: string } {
        return { message: "Duplicate Entry" };
    }
}

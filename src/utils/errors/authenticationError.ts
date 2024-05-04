import CustomError from "./customError";

export default class AuthenticationError extends CustomError {
    statusCode = 401;
    constructor() {
        super("Unauthorized");
        Object.setPrototypeOf(this, AuthenticationError.prototype);
    }
    serialize(): { message: string } {
        return { message: "Unauthorized" };
    }
}

import CustomError from "./customError";

export default class AuthorizationError extends CustomError {
    statusCode = 403;
    constructor() {
        super("Unauthorized Access");
        Object.setPrototypeOf(this, AuthorizationError.prototype);
    }
    serialize(): { message: string } {
        return { message: "Unauthorized Access" };
    }
}

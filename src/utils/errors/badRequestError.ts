import CustomError from "./customError";

export default class BadRequestError extends CustomError {
    statusCode = 400;
    constructor() {
        super("Bad Request");
        Object.setPrototypeOf(this, BadRequestError.prototype);
    }
    serialize(): { message: string } {
        return { message: "Bad Request" };
    }
}

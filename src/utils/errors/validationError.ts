import CustomError from "./customError";

export default class ValidationError extends CustomError {
    statusCode = 422;
    constructor() {
        super("Validation Error");
        Object.setPrototypeOf(this, ValidationError.prototype);
    }
    serialize(): { message: string } {
        return { message: "Validation Error" };
    }
}

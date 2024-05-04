import CustomError from "./customError";

export default class DatabaseError extends CustomError {
    statusCode = 500;
    constructor() {
        super("Database Error");
        Object.setPrototypeOf(this, DatabaseError.prototype);
    }
    serialize(): { message: string } {
        return { message: "Database Error" };
    }
}

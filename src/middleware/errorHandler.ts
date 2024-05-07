import { Request, Response, NextFunction } from "express";
import CustomError from "../utils/errors/customError";
import { NODE_ENV } from "../config/config";

const errorHandler = (err: Error, req: Request, res: Response, next: NextFunction) => {
    if (err instanceof CustomError) {
        return res.status(err.statusCode).json(err.serialize());
    }
    return res.status(500).json(
        Object.assign(
            {
                message: err.message || "Internal Server Error",
            },
            NODE_ENV === "dev" ? { stack: err.stack } : null
        )
    );
};

export default errorHandler;

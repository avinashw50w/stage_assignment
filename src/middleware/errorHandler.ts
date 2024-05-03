import { Request, Response, NextFunction } from "express";

const errorHandler = (err: any, req: Request, res: Response, next: NextFunction) => {
    const errStatus = err.statusCode || 500;
    const errMsg = err.message || "Internal Server Error";
    res.status(errStatus).json(
        Object.assign(
            {
                success: false,
                status: errStatus,
                message: errMsg,
            },
            process.env.NODE_ENV === "dev" ? { stack: err.stack } : null
        )
    );
};

export default errorHandler;

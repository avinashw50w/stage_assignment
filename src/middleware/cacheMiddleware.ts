import { Response, NextFunction } from "express";
import { AuthRequest } from "../customTypes";
import cacheService from "../services/cache/cacheService";
import responseHandler from "../responseHandler";

async function cacheMiddleware(key: string) {
    return async function (req: AuthRequest, res: Response, next: NextFunction) {
        try {
            const data = await cacheService.get(key);
            return data ? responseHandler.successResponse(req, res, data) : next();
        } catch (err: any) {
            return next();
        }
    };
}

export default cacheMiddleware;

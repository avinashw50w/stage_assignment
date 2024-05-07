import { Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { AuthRequest } from "../customTypes";
import AuthenticationError from "../utils/errors/authenticationError";
import AuthorizationError from "../utils/errors/authorizationError";
import { ACCESS_TOKEN_SECRET } from "../config/config";

const secretKey = ACCESS_TOKEN_SECRET as string;

function authenticate(req: AuthRequest, res: Response, next: NextFunction) {
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];
    if (token == null) return next(new AuthenticationError());

    jwt.verify(token, secretKey, (err, user) => {
        if (err) return next(new AuthorizationError()); // Forbidden
        req.user = user;
        next();
    });
}

export default authenticate;

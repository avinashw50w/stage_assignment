import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { ACCESS_TOKEN_SECRET } from "../config/config";
import { Users } from "../models";
import AuthenticationError from "../utils/errors/authenticationError";

class AuthController {
    private static readonly secretKey = ACCESS_TOKEN_SECRET as string;

    async login(req: Request, res: Response, next: NextFunction) {
        const { username, password } = req.body as { username: string; password: string };
        const user = await Users.findOne({ username }).select({ username: 1, password: 1 }).exec();

        if (!user) return next(new AuthenticationError());

        const passChk = await bcrypt.compare(password, user.password);

        if (!passChk) return next(new AuthenticationError());

        const token = jwt.sign({ username: user.username, id: user.id }, AuthController.secretKey);
        res.json({ token });
    }
}

const authController = new AuthController();

export default authController;

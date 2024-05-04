import { body } from "express-validator";

const login = [
    body("username").isString().notEmpty().withMessage("username is required"),
    body("password").isString().notEmpty().withMessage("password is required"),
];

export default {
    login,
};

import {Router} from "express";
const router = Router();
import authController from "../../controller/authConroller";
import validator from "../../validation/validator";
import authValidation from "../../validation/authValidation";


router.post('/login', validator.validate(authValidation.login), authController.login);

export default router;
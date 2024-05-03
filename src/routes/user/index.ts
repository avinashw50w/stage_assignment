import { Router } from "express";
const router = Router();
import authenticate from "../../middleware/auth";
import userController from "../../controller/userController";
import validator from "../../validation/validator";
import responseHandler from "../../responseHandler";
import rateLimiter from "../../middleware/rateLimit";
import { AuthRequest } from "../../customTypes";
import { DEFAULT_PAGE_SIZE } from "../../constants";
import userListValidation from "../../validation/userListValidation";

router.post("/add-item", authenticate, rateLimiter, validator.validate(userListValidation.addItem), async (req: AuthRequest, res) => {
    const user = req.user;
    const itemId = req.body.itemId;
    const itemType = req.body.itemType;

    return userController
        .addItem(user.id, itemId, itemType)
        .then((response) => responseHandler.successResponse(req, res, response, 201))
        .catch((err) => responseHandler.errorResponse(req, res, err));
});

router.post("/remove-item", authenticate, rateLimiter, validator.validate(userListValidation.removeItem), async (req: AuthRequest, res) => {
    const user = req.user;
    const id = req.body.id;

    return userController
        .removeItem(id)
        .then((response) => responseHandler.successResponse(req, res, response))
        .catch((err) => responseHandler.errorResponse(req, res, err));
});

router.get("/list-item", authenticate, validator.validate(userListValidation.listItem), async (req: AuthRequest, res) => {
    const user = req.user;
    const page = req.query.page || 1;
    const pageSize = req.query.pageSize || DEFAULT_PAGE_SIZE;

    return userController
        .getPaginatedItems(user.id, Number(page), Number(pageSize))
        .then((response) => responseHandler.successResponse(req, res, response))
        .catch((err) => responseHandler.errorResponse(req, res, err));
});

export default router;

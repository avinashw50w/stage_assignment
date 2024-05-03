import {body, query} from "express-validator";

const addItem = [
    body('itemId').isString().notEmpty().withMessage('itemId is required'),
    body('itemType').isString().notEmpty().withMessage('itemType is required'),
];
const removeItem = [
    body('id').isString().notEmpty().withMessage('id is required'),
];

const listItem = [
    query('page').isNumeric().optional(),
    query('pageSize').isNumeric().optional(),
];

export default {
    addItem,
    removeItem,
    listItem
}
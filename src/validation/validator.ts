import { Request, Response, NextFunction } from 'express';
import { validationResult, ContextRunner } from 'express-validator';

const validate = (validations: ContextRunner[]) => {
    return async (req: Request, res: Response, next: NextFunction) => {
      for (let validation of validations) {
        const result = await validation.run(req);
        if (!result.isEmpty()) break;
      }
  
      const errors = validationResult(req);
      if (errors.isEmpty()) {
        return next();
      }
      res.status(422).json({ errors: errors.array() });
    };
  };

export default {
    validate,
}
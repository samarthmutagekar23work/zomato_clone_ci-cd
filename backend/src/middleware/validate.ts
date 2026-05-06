import { Request, Response, NextFunction } from 'express';
import { validationResult, ValidationChain, body } from 'express-validator';
import { logger } from '../utils/logger';

export const validate = (chains: ValidationChain[]) => {
  return async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    await Promise.all(chains.map(chain => chain.run(req)));
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      logger.warn('Validation failed', {
        path: req.path,
        errors: errors.array(),
        ip: req.ip,
      });
      res.status(422).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array().map(e => ({ field: e.type, message: e.msg })),
      });
      return;
    }
    next();
  };
};

export const registerValidator: ValidationChain[] = [
  body('email').isEmail().normalizeEmail().trim(),
  body('password')
    .isLength({ min: 8, max: 128 })
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])/),
  body('name').trim().isLength({ min: 2, max: 100 }).escape(),
  body('phone').isMobilePhone('en-IN').trim(),
];

export const loginValidator: ValidationChain[] = [
  body('email').isEmail().normalizeEmail().trim(),
  body('password').isLength({ min: 8, max: 128 }),
];

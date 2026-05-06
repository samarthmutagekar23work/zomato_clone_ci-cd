import winston from 'winston';
import { env } from '../config/env';

const SENSITIVE_FIELDS = ['password', 'token', 'secret', 'authorization', 'cookie', 'creditcard', 'cvv', 'otp'];

const redactSensitiveData = winston.format((info) => {
  const redacted = { ...info };
  SENSITIVE_FIELDS.forEach((field: string) => {
    if (redacted[field]) {
      redacted[field] = '[REDACTED]';
    }
  });
  return redacted;
});

export const logger = winston.createLogger({
  level: env.NODE_ENV === 'production' ? 'warn' : 'debug',
  format: winston.format.combine(
    redactSensitiveData(),
    winston.format.timestamp(),
    winston.format.errors({ stack: true }),
    env.NODE_ENV === 'production'
      ? winston.format.json()
      : winston.format.colorize({ all: true }),
    winston.format.printf(({ timestamp, level, message, ...meta }) =>
      `${timestamp} [${level}]: ${message} ${Object.keys(meta).length ? JSON.stringify(meta) : ''}`
    )
  ),
  transports: [
    new winston.transports.Console(),
    ...(env.NODE_ENV === 'production' ? [
      new winston.transports.File({ filename: 'logs/error.log', level: 'error' }),
      new winston.transports.File({ filename: 'logs/combined.log' }),
    ] : []),
  ],
  exceptionHandlers: [new winston.transports.File({ filename: 'logs/exceptions.log' })],
  rejectionHandlers: [new winston.transports.File({ filename: 'logs/rejections.log' })],
});

import dotenv from 'dotenv';
import { env } from './config/env';
import app from './app';

dotenv.config();

const PORT = env.PORT;

const server = app.listen(PORT, () => {
  process.stdout.write(`Server running on port ${PORT} in ${env.NODE_ENV} mode\n`);
});

const shutdownSignals = ['SIGTERM', 'SIGINT'];

shutdownSignals.forEach((signal) => {
  process.on(signal, () => {
    process.stdout.write(`Received ${signal}, shutting down gracefully\n`);
    server.close(() => {
      process.stdout.write('Server closed\n');
      process.exit(0);
    });
  });
});

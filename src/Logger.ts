import pinologger from 'pino';

// Logger instance.
const logger = pinologger({
  level: process.env.log_level || "debug",
});

export default logger;
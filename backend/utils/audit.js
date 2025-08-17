import logger from "./logger.js";

export function logTx(type, payload, userId) {
  logger.info({ type, payload, userId, timestamp: new Date().toISOString() });
}

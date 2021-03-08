/**
 * Describe feedback/message disposition
 */
export enum DispositionType {
  /**
   * Generic Informational (non-blocking)
   */
  INFO = 0,
  /**
   * Warning (non-blocking)
   */
  WARN = 1,
  /**
   * Error (blocking) - e.g., field-level validation failure
   */
  ERROR = 2,
  /**
   * Critical (blocking) - something significant broke
   */
  CRITICAL = 3,
  /**
   * Debug-only message output (non-blocking)
   */
  DEBUG = 4,
}

import { IIdentifiable } from "./identifiable";
import { ITitled } from "./titled";
import { ITimeStamped } from "./timestamped";

/**
 * Form entity with standard metadata (identity, title, timestamp, etc.)
 */
export type IFormEntityBase = IIdentifiable & ITitled & ITimeStamped;

export * from "./identifiable";
export * from "./timestamped";
export * from "./titled";

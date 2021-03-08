/**
 * Any object with create/update timestamps
 */
export interface ITimeStamped {
  /**
   * "Created" timestamp, with hours + minutes + seconds + optional GMT offset
   * Format: YYYY-MM-DDThh:mm:ssTZD
   *
   * @example 2020-07-16T19:20:30+01:00
   */
  created: string;
  /**
   * "Updated" timestamp, with hours + minutes + seconds + optional GMT offset
   * Format: YYYY-MM-DDThh:mm:ssTZD
   *
   * @example 2020-07-16T19:20:30+01:00
   */
  updated: string;
}

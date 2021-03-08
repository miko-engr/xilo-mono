/**
 * If a given field is an input, this will allow discriminating based on principal type
 */
export enum InputFieldType {
  TEXT = 0,
  NUMERIC = 1,
  /**
   * Mult. choice/single answer- can be extended with async search, creation limits, etc.
   */
  MULTIPLE_CHOICE = 2,
  /**
   * Mult. answer- can be extended with async search, creation limits, etc.
   */
  MULTIPLE_ANSWER = 3,

  /**
   * File input- can be extended with async search, single/multiple limits, preview, etc.
   */
  FILE_INPUT = 4,
  /**
   * Signature capture
   */
  SIGNATURE = 5,

  /**
   * Dropdown menu- single or multiple select?
   */
  DROPDOWN_MENU = 6,

  /**
   * Slider/scale
   */
  SCALE_SLIDER = 7,
}

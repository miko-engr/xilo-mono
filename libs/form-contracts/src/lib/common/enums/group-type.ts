/**
 * Describe type of specified element group
 */
export enum GroupType {
  /**
   * All components for a form in one page/group
   */
  ALL = 0,

  /**
   * Single page within a form. May include a header
   */
  PAGE = 1,
  /**
   * Some number of form components. May include a header
   */
  FRAGMENT = 2,
}

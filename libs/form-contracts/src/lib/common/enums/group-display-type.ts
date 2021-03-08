/**
 * At the top (container) level: determine whether to show groups page-by-page (default)
 * or as one
 */
export enum GroupDisplayType{
    /**
     * Show one group per page (default)
     */
    PAGINATED = 0,
    /**
     * Show all groups on one page
     */
    CONCATENATED = 1
}
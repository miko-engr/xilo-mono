export interface Zapiersync {
    id: number;
    createdAt: Date | null;
    updatedAt: Date | null;
    companyId: string | null;
    lastSyncTime: Date | null;
    agentLastSyncTime: Date | null;
    eventLastSyncTime: Date | null;
    lifecycleLastSyncTime: Date | null;
}
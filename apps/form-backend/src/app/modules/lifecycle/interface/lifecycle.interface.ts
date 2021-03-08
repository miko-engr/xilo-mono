export interface Lifecycle {
  id: number;
  isEnabled: boolean | null;
  isNewClient: boolean | null;
  isSold: boolean | null;
  name: string | null;
  color: string | null;
  sequenceNumber: number | null;
  createdAt: Date;
  updatedAt: Date;
  isQuoted: boolean | null;
  targetYear: number | null;
  targetMonth: number | null;
  targetWeek: number | null;
  targetDay: number | null;
  // companies: number | number[];
}

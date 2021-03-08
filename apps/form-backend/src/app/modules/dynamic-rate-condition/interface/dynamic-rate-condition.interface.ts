export interface DynamicRateCondition  {
    id: number;
    conditions: object[] | null;
    createdAt: string;
    updatedAt: string;
    answerDynamicParameterId: number;
    companyDynamicParameterId: number;
    dynamicRateDynamicParameterId: number;
}
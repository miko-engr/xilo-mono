export interface Condition {
  id?: number;
  createdAt: Date;
  updatedAt: Date;
  title: string;
  object: string;
  key: string;
  operator: string;
  value: string;
  companyConditionId: number;
  answerCondition: object; // TODO should be replcaed to Answers interface
  pageCondition: object; // TODO should be replcaed to Pages interface
  questionCondition: object; // TODO should be replcaed to Questions interface
}

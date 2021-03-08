export class SummaryItem {
  title?: string;
  pageIndex?: number;
  isCreatedAtRunTime?: boolean;
  pageid?: number;
  valid?: boolean;
  subIndex?: number;
  pristine?: boolean;
  lastQuestionIndex?: number;
  answers?: AnswerItemInSummary[];
  hidden?: boolean;
  objectName?: string;
}

export interface AnswerItemInSummary {
  questionIndex: number;
  answerValue: any;
  propertyKey: string;
  answerIndex: number;
  answerType: string;
  objectName: string;
  id: string;
}

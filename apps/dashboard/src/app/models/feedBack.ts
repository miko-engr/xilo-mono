export class FeedBack {
    constructor(
        public id?: number,
        public type?: string,
        public formId?: number,
        public questionId?: string,
        public userId?: string,
        public feedback?: string,
        public title?: string
    ) {}
}
export class generalFormFeedbackList {
  feedBack: FeedBack[] = [];
}

export class questionFeedbackList {
  feedBack: FeedBack[] = [];
}

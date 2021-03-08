
export class Response {
  constructor(
    public value?: any,
    public questionText?: string,
    public answerResponseId?: number,
    public discountResponseId?: number,
    public pageResponseId?: number
  ) {}
}

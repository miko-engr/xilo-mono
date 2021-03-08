 
export class Payment {
  id: number
  name: string
  firstName: string
  email: string
  cardNumber: string
  issueDate: string
  cvv: string
  interval: string
  cardNumberError: ErrorMessage
  issueDateError: ErrorMessage
  cvvError: ErrorMessage
}

export class ErrorMessage{
  message:string
}

export class StripeData  {
  firstName:string
  email: string
  stripe: any
  card: any
};

export class SubscribeObj {
  plans: Plan[] = []
  coupon: string
}

export class Plan {
  plan: string
}

export class PaymentDetails {
  planId: string;
  subscriptionAmount: number;
  interval: string;
  discountCoupanCode: string;
  discountCoupan: string;
  productName: string;
  setupFees: string;
  amount: number;
  percent_off: number;
  last4: string;
  exp_month: string;
  exp_year: string;
  discountId: string;
  discounts: Discount[];
  paymentPlans: PaymentPlan[]
}

export class Discount {
  id: string
  percent_off: number
  percent_off_precise: number
}

export class PaymentPlan {
  id: string
  object: string
  amount: number
  interval: string
}
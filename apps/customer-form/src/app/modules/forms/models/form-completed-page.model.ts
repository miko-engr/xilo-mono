export class FormCompletedPageResponse {
  constructor(
    public banner: {
      title?: string;
      link?: string;
      image?: string;
    },
    public bundleFormIds: number[],
    public hasOtherOffers?: boolean,
    public otherOffersTitle?: string
  ) {}
}

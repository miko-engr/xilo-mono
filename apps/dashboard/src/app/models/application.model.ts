import { Client } from "./client.model";
import { Company } from "./company.model";
import { Form } from "./form.model";
import { Response } from "./response.model";
import { Rate } from "./rate.model";

export class Application {
  constructor(
    public id?: number,
    public isComplete?: boolean,
    public hasRatesCreated?: boolean,
    public responses?: Response[],
    public companyApplicationId?: number,
    public clientApplicationId?: number,
    public formApplicationId?: number,
    public company?: Company,
    public client?: Client,
    public form?: Form,
    public rates?: Rate[]
  ) {}
}

import { Form, Page, Question, Answer } from '.';

export interface CompanyDataResponse {
  form?: Form;
  pages?: Page[];
  questions?: Question[];
  answers?: Answer[];
}

import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Answers } from "../../entities/Answers";
import { Companies } from "../company/company.entity";
import { Questions } from "../../entities/Questions";

@Entity("DynamicRateConditions", { schema: "public" })
export class DynamicRateConditions {
  @PrimaryGeneratedColumn({ type: "integer", name: "id" })
  id: number;

  @Column("character varying", {
    name: "operator",
    nullable: true,
    length: 255,
    default: () => "NULL::character varying",
  })
  operator: string | null;

  @Column("character varying", {
    name: "value",
    nullable: true,
    length: 255,
    default: () => "NULL::character varying",
  })
  value: string | null;

  @Column("double precision", {
    name: "multiplier",
    nullable: true,
    precision: 53,
  })
  multiplier: number | null;

  @Column("timestamp with time zone", { name: "createdAt" })
  createdAt: string;

  @Column("timestamp with time zone", { name: "updatedAt" })
  updatedAt: string;

  @Column("character varying", {
    name: "valueRange",
    nullable: true,
    length: 255,
    default: () => "NULL::character varying",
  })
  valueRange: string | null;

  @Column("double precision", {
    name: "increase",
    nullable: true,
    precision: 53,
  })
  increase: number | null;

  @Column("character varying", {
    name: "change",
    nullable: true,
    length: 255,
    default: () => "NULL::character varying",
  })
  change: string | null;

  @Column({ type: "integer", name: "companyDynamicRateConditionId" })
  companyDynamicRateConditionId: number;

  @ManyToOne(() => Answers, (answers) => answers.dynamicRateConditions, {
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
  })
  @JoinColumn([
    { name: "answerDynamicRateConditionId", referencedColumnName: "id" },
  ])
  answers: Answers[];

  @ManyToOne(() => Companies, (companies) => companies.dynamicRateConditions, {
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
  })
  @JoinColumn([
    { name: "companyDynamicRateConditionId", referencedColumnName: "id" },
  ])
  company: Companies;

  @ManyToOne(() => Questions, (questions) => questions.dynamicRateConditions, {
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
  })
  @JoinColumn([
    { name: "questionDynamicRateConditionId", referencedColumnName: "id" },
  ])
  question: Questions[];
}

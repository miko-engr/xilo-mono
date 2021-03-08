import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Answers } from '../../entities/Answers';
import { Forms } from '../form/forms.entity';
import { integer } from 'aws-sdk/clients/lightsail';

@Entity("Integrations", { schema: "public" })
export class Integrations {
  @PrimaryGeneratedColumn({ type: "integer", name: "id" })
  id: number;

  @Column("character varying", {
    name: "vendorName",
    nullable: true,
    length: 255,
  })
  vendorName: string | null;

  @Column("character varying", {
    name: "parentGroup",
    nullable: true,
    length: 255,
  })
  parentGroup: string | null;

  @Column("character varying", { name: "group", nullable: true, length: 255 })
  group: string | null;

  @Column("character varying", { name: "element", nullable: true, length: 255 })
  element: string | null;

  @Column("character varying", {
    name: "processLevel",
    nullable: true,
    length: 255,
  })
  processLevel: string | null;

  @Column("character varying", {
    name: "subLevel",
    nullable: true,
    length: 255,
  })
  subLevel: string | null;

  @Column("character varying", {
    name: "xiloObject",
    nullable: true,
    length: 255,
  })
  xiloObject: string | null;

  @Column("character varying", { name: "xiloKey", nullable: true, length: 255 })
  xiloKey: string | null;

  @Column("text", { name: "value", nullable: true })
  value: string | null;

  @Column("integer", { name: "index", nullable: true })
  index: number | null;

  @Column("json", { name: "transformation", nullable: true })
  transformation: object | null;

  @Column("timestamp with time zone", { name: "createdAt" })
  createdAt: Date;

  @Column("timestamp with time zone", { name: "updatedAt" })
  updatedAt: Date;

  @Column("character varying", {
    name: "arrayKey",
    nullable: true,
    length: 255,
  })
  arrayKey: string | null;

  @Column("character varying", {
    name: "al3Length",
    nullable: true,
    length: 255,
  })
  al3Length: string | null;

  @Column("character varying", {
    name: "parentIndex",
    nullable: true,
    length: 255,
  })
  parentIndex: string | null;

  @Column("character varying", {
    name: "parentProcessLevel",
    nullable: true,
    length: 255,
  })
  parentProcessLevel: string | null;

  @Column("boolean", {
    name: "iterative",
    nullable: true,
    default: () => "false",
  })
  iterative: boolean | null;

  @Column("boolean", {
    name: "required",
    nullable: true,
    default: () => "false",
  })
  required: boolean | null;

  @Column("integer", { name: "sequence", nullable: true })
  sequence: number | null;

  @Column("character varying", {
    name: "al3Start",
    nullable: true,
    length: 255,
  })
  al3Start: string | null;

  @Column("character varying", { name: "lob", nullable: true, length: 255 })
  lob: string | null;

  @Column("character varying", {
    name: "dataType",
    nullable: true,
    length: 255,
  })
  dataType: string | null;

  @Column("character varying", {
    name: "classType",
    nullable: true,
    length: 255,
  })
  classType: string | null;

  @Column("character varying", {
    name: "al3GroupLength",
    nullable: true,
    length: 255,
  })
  al3GroupLength: string | null;

  @Column("character varying", {
    name: "al3GroupName",
    nullable: true,
    length: 255,
  })
  al3GroupName: string | null;

  @Column("character varying", {
    name: "referenceId",
    nullable: true,
    length: 255,
  })
  referenceId: string | null;

  @Column("integer", {
    name: "formIntegrationId",
    nullable: true,
  })
  formIntegrationId: number | null;

  @Column("integer", {
    name: "answerIntegrationId",
    nullable: true,
  })
  answerIntegrationId: number | null;

  @Column("boolean", { name: "isChild", nullable: true })
  isChild: boolean | null;

  @ManyToOne(() => Answers, (answers) => answers.integrations, {
    onDelete: "SET NULL",
  })
  @JoinColumn([{ name: "answerIntegrationId", referencedColumnName: "id" }])
  Answers : Answers[];

  @ManyToOne(() => Forms, (forms) => forms.integrations2, {
    onDelete: "SET NULL",
  })
  @JoinColumn([{ name: "formIntegrationId", referencedColumnName: "id" }])
  formIntegration: Forms[];
}

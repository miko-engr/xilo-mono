import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Clients } from '../client/client.entity';
import { Companies } from '../company/company.entity';
import { Flows } from '../flow/flows.entity';

@Entity("TextMessages", { schema: "public" })
export class TextMessages {
  @PrimaryGeneratedColumn({ type: "integer", name: "id" })
  id: number;

  @Column("character varying", { name: "to", nullable: true, length: 255 })
  to: string | null;

  @Column("text", { name: "body", nullable: true })
  body: string | null;

  @Column("timestamp with time zone", {
    name: "scheduledDate",
    nullable: true,
    default: () => "'2019-09-11 19:58:25.91-07'",
  })
  scheduledDate: Date | null;

  @Column("boolean", {
    name: "isSchedule",
    nullable: true,
    default: () => "true",
  })
  isSchedule: boolean | null;

  @Column("timestamp with time zone", { name: "createdAt" })
  createdAt: Date;

  @Column("timestamp with time zone", { name: "updatedAt" })
  updatedAt: Date;

  @Column("character varying", {
    name: "replySid",
    nullable: true,
    length: 255,
    default: () => "NULL::character varying",
  })
  replySid: string | null;

  @Column("character varying", {
    name: "replyStatus",
    nullable: true,
    length: 255,
    default: () => "NULL::character varying",
  })
  replyStatus: string | null;

  @Column("character varying", {
    name: "replyErrorCode",
    nullable: true,
    length: 255,
    default: () => "NULL::character varying",
  })
  replyErrorCode: string | null;

  @Column("character varying", {
    name: "replyErrorMessage",
    nullable: true,
    length: 255,
    default: () => "NULL::character varying",
  })
  replyErrorMessage: string | null;

  @Column("boolean", {
    name: "isSentNow",
    nullable: true,
    default: () => "false",
  })
  isSentNow: boolean | null;

  @Column("character varying", { name: "status", nullable: true, length: 255 })
  status: string | null;

  @Column("boolean", {
    name: "fromClient",
    nullable: true,
    default: () => "false",
  })
  fromClient: boolean | null;

  @Column("character varying", { name: "from", nullable: true, length: 255 })
  from: string | null;

  @Column("integer", { name: "companyTextMessageId", nullable: true })
  companyTextMessageId: number | null;

  @ManyToOne(() => Clients, (clients) => clients.textMessages, {
    onDelete: "SET NULL",
    onUpdate: "CASCADE",
  })
  @JoinColumn([{ name: "clientTextMessageId", referencedColumnName: "id" }])
  clientTextMessage: Clients[];

  @ManyToOne(() => Companies, (companies) => companies.textMessages, {
    onDelete: "SET NULL",
    onUpdate: "CASCADE",
  })
  @JoinColumn([{ name: "companyTextMessageId", referencedColumnName: "id" }])
  companyTextMessage: Companies[];

  @ManyToOne(() => Flows, (flows) => flows.textMessages, {
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
  })
  @JoinColumn([{ name: "flowTextMessageId", referencedColumnName: "id" }])
  flowTextMessage: Flows[];
}

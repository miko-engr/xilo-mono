import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Clients } from '../client/client.entity';
import { Companies } from '../company/company.entity';
import { Flows } from '../flow/flows.entity';
import { integer } from 'aws-sdk/clients/cloudfront';

@Entity('Emails', { schema: 'public' })
export class Emails {
  @PrimaryGeneratedColumn({ type: 'integer', name: 'id' })
  id: number;

  @Column('character varying', {
    name: 'recipient',
    nullable: true,
    length: 255,
  })
  recipient: string | null;

  @Column('character varying', { name: 'sender', nullable: true, length: 255 })
  sender: string | null;

  @Column('text', { name: 'subject', nullable: true })
  subject: string | null;

  @Column('text', { name: 'body', nullable: true })
  body: string | null;

  @Column('timestamp with time zone', {
    name: 'scheduledDate',
    nullable: true,
    default: () => new Date(),
  })
  scheduledDate: Date | null;

  @Column('boolean', {
    name: 'isSchedule',
    nullable: true,
    default: () => true,
  })
  isSchedule: boolean | null;

  @Column('character varying', {
    name: 'replyStatus',
    nullable: true,
    length: 255,
    default: () => null,
  })
  replyStatus: string | null;

  @Column('character varying', {
    name: 'replyErrorMessage',
    nullable: true,
    length: 255,
    default: () => null,
  })
  replyErrorMessage: string | null;

  @CreateDateColumn({ name: 'createdAt' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updatedAt' })
  updatedAt: Date;

  @Column('boolean', {
    name: 'isSentNow',
    nullable: true,
    default: () => false,
  })
  isSentNow: boolean | null;

  @Column('character varying', { name: 'status', nullable: true, length: 255 })
  status: string | null;

  @Column('boolean', {
    name: 'fromClient',
    nullable: true,
    default: () => false,
  })
  fromClient: boolean | null;

  @Column('character varying', {
    name: 'responseUid',
    nullable: true,
    length: 255,
  })
  responseUid: string | null;

  @Column('character varying', {
    name: 'flowEmailId',
    nullable: true,
  })
  flowEmailId: integer | null;

  @ManyToOne(() => Clients, (clients) => clients.emails, {
    onDelete: 'SET NULL',
    onUpdate: 'CASCADE',
  })
  @JoinColumn([{ name: 'clientEmailId', referencedColumnName: 'id' }])
  clientEmail: Clients[];

  @ManyToOne(() => Companies, (companies) => companies.emails, {
    onDelete: 'SET NULL',
    onUpdate: 'CASCADE',
  })
  @JoinColumn([{ name: 'companyEmailId', referencedColumnName: 'id' }])
  companyEmail: Companies[];

  @ManyToOne(() => Flows, (flows) => flows.emails, {
    onDelete: 'SET NULL',
    onUpdate: 'CASCADE',
  })
  @JoinColumn([{ name: 'flowEmailId', referencedColumnName: 'id' }])
  flowEmail: Flows[];
}

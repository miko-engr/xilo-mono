import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Agents } from '../agent/agent.entity';
import { Clients } from '../client/client.entity';
import { Companies } from '../company/company.entity';

@Entity('Tasks', { schema: 'public' })
export class Tasks {
  @PrimaryGeneratedColumn({ type: 'integer', name: 'id' })
  id: number;

  @CreateDateColumn({ name: 'createdAt', nullable: true })
  createdAt: Date | null;

  @UpdateDateColumn({ name: 'updatedAt', nullable: true })
  updatedAt: Date | null;

  @Column('character varying', { name: 'type', nullable: true, length: 255 })
  type: string | null;

  @Column('text', { name: 'description', nullable: true })
  description: string | null;

  @Column('character varying', {
    name: 'priority',
    nullable: true,
    length: 255,
  })
  priority: string | null;

  @Column('character varying', {
    name: 'scheduledDate',
    nullable: true,
    length: 255,
  })
  scheduledDate: string | null;

  @Column('boolean', {
    name: 'isSchedule',
    nullable: true,
    default: () => true,
  })
  isSchedule: boolean | null;

  @Column('boolean', {
    name: 'isSentNow',
    nullable: true,
    default: () => false,
  })
  isSentNow: boolean | null;

  @Column('boolean', {
    name: 'isCompleted',
    nullable: true,
    default: () => false,
  })
  isCompleted: boolean | null;

  @Column('character varying', {
    name: 'completedDate',
    nullable: true,
    length: 255,
  })
  completedDate: string | null;

  @Column('character varying', {
    name: 'reminderDate',
    nullable: true,
    length: 255,
  })
  reminderDate: string | null;

  @Column('boolean', {
    name: 'reminderSent',
    nullable: true,
    default: () => false,
  })
  reminderSent: boolean | null;

  @Column('integer', { name: 'agentTaskId', nullable: true })
  agentTaskId: number | null;

  @Column('integer', { name: 'clientTaskId', nullable: true })
  clientTaskId: number | null;

  @Column('integer', { name: 'companyTaskId', nullable: true })
  companyTaskId: number | null;

  @ManyToOne(() => Agents, (agents) => agents.tasks)
  @JoinColumn([{ name: 'agentTaskId', referencedColumnName: 'id' }])
  agent: Agents;

  @ManyToOne(() => Clients, (clients) => clients.tasks)
  @JoinColumn([{ name: 'clientTaskId', referencedColumnName: 'id' }])
  client: Clients;

  @ManyToOne(() => Companies, (companies) => companies.tasks)
  @JoinColumn([{ name: 'companyTaskId', referencedColumnName: 'id' }])
  company: Companies;
}

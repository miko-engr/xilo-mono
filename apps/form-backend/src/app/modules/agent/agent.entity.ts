import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Forms } from '../form/forms.entity';
import { Clients } from '../client/client.entity';
import { LifecycleAnalytics } from '../lifecycle-analytics/LifecycleAnalytics.entity';
import { Notes } from '../note/note.entity';
import { Tasks } from '../task/tasks.entity';
import { Companies } from '../company/company.entity';
@Entity('Agents', { schema: 'public' })
export class Agents {
  @PrimaryGeneratedColumn({ type: 'integer', name: 'id' })
  id: number;

  @Column('character varying', {
    name: 'name',
    nullable: true,
    length: 255,
    default: () => null,
  })
  name: string | null;

  @Column('character varying', { name: 'email', length: 255 })
  email: string;

  @CreateDateColumn({ name: 'createdAt' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updatedAt' })
  updatedAt: Date;

  @Column('character varying', {
    name: 'password',
    nullable: true,
    length: 255,
    default: () => null,
  })
  password: string | null;

  @Column('boolean', {
    name: 'isPrimaryAgent',
    nullable: true,
    default: () => true,
  })
  isPrimaryAgent: boolean | null;

  @Column('character varying', {
    name: 'firstName',
    nullable: true,
    length: 255,
    default: () => null,
  })
  firstName: string | null;

  @Column('character varying', {
    name: 'lastName',
    nullable: true,
    length: 255,
    default: () => null,
  })
  lastName: string | null;

  @Column('character varying', {
    name: 'lineOfBusiness',
    nullable: true,
    length: 255,
    default: () => null,
  })
  lineOfBusiness: string | null;

  @Column('boolean', {
    name: 'canSeeAllClients',
    nullable: true,
    default: () => true,
  })
  canSeeAllClients: boolean | null;

  @Column('character varying', {
    name: 'resetPasswordLink',
    nullable: true,
    length: 255,
    default: () => null,
  })
  resetPasswordLink: string | null;

  @Column('varchar', { name: 'tags', nullable: true, array: true })
  tags: string[] | null;

  @Column('boolean', {
    name: 'canSeeTagsOnly',
    nullable: true,
    default: () => false,
  })
  canSeeTagsOnly: boolean | null;

  @Column('character varying', {
    name: 'producerCode',
    nullable: true,
    length: 255,
  })
  producerCode: string | null;

  @Column('character varying', {
    name: 'executiveCode',
    nullable: true,
    length: 255,
  })
  executiveCode: string | null;

  @Column('int', { name: 'agentIds', nullable: true, array: true })
  agentIds: number[] | null;

  @Column('integer', { name: 'agentFormId', nullable: true })
  agentFormId: number | null;

  @Column('boolean', {
    name: 'canSeeAgentsOnly',
    nullable: true,
    default: () => false,
  })
  canSeeAgentsOnly: boolean | null;

  @Column('json', { name: 'notificationJson', nullable: true })
  notificationJson: object | null;

  @Column('character varying', { name: 'phone', nullable: true, length: 255 })
  phone: string | null;

  @Column('json', { name: 'settings', nullable: true })
  settings: object | null;

  @Column('timestamp with time zone', {
    name: 'lastAssignmentDate',
    nullable: true,
    default: () => "'2020-04-10 20:56:30.332-07'",
  })
  lastAssignmentDate: Date | null;

  @Column('character varying', {
    name: 'betterAgencyUsername',
    nullable: true,
    length: 255,
  })
  betterAgencyUsername: string | null;

  @Column('int') companyAgentId: number | null;

  @ManyToOne(() => Forms, (forms) => forms.agents, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn([{ name: 'agentFormId', referencedColumnName: 'id' }])
  agentForm: Forms;

  @ManyToOne(() => Companies, (companies) => companies.agents, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn({ name: 'companyAgentId', referencedColumnName: 'id' })
  companies: Companies;

  @OneToMany(() => Clients, (clients) => clients.agents)
  clients: Clients[];

  @OneToMany(
    () => LifecycleAnalytics,
    (lifecycleAnalytics) => lifecycleAnalytics.agentLifecycleAnalytic
  )
  lifecycleAnalytics: LifecycleAnalytics[];

  @OneToMany(() => Notes, (notes) => notes.agentNote)
  notes: Notes[];

  @OneToMany(() => Tasks, (tasks) => tasks.agent)
  tasks: Tasks[];
}

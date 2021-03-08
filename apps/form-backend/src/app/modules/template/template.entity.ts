import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Companies } from '../company/company.entity';

@Index('Templates_pkey', ['id'], { unique: true })
@Entity('Templates', { schema: 'public' })
export class Templates {
  @PrimaryGeneratedColumn({ type: 'integer', name: 'id' })
  id: number;

  @Column('character varying', {
    name: 'title',
    nullable: true,
    length: 255,
    default: () => 'NULL::character varying',
  })
  title: string | null;

  @Column('text', { name: 'body', nullable: true })
  body: string | null;

  @Column('boolean', { name: 'isText', nullable: true, default: () => 'false' })
  isText: boolean | null;

  @Column('boolean', {
    name: 'isEmail',
    nullable: true,
    default: () => 'false',
  })
  isEmail: boolean | null;

  @Column('timestamp with time zone', { name: 'createdAt', nullable: true })
  createdAt: string | null;

  @Column('timestamp with time zone', { name: 'updatedAt', nullable: true })
  updatedAt: string | null;

  @Column('character varying', {
    name: 'subject',
    nullable: true,
    length: 255,
    default: () => 'NULL::character varying',
  })
  subject: string | null;

  @Column('boolean', { name: 'isTask', nullable: true, default: () => 'false' })
  isTask: boolean | null;

  @Column('character varying', {
    name: 'type',
    nullable: true,
    length: 255,
    default: () => 'NULL::character varying',
  })
  type: string | null;

  @Column('character varying', {
    name: 'description',
    nullable: true,
    length: 255,
    default: () => 'NULL::character varying',
  })
  description: string | null;

  @Column('character varying', {
    name: 'priority',
    nullable: true,
    length: 255,
    default: () => 'NULL::character varying',
  })
  priority: string | null;

  @Column('integer', {
    name: 'companyTemplateId',
    nullable: true,
  })
  companyTemplateId: number | null;

  @ManyToOne(() => Companies, (companies) => companies.templates, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
    eager: true,
  })
  @JoinColumn([{ name: 'companyTemplateId', referencedColumnName: 'id' }])
  companyTemplate: Companies[];
}

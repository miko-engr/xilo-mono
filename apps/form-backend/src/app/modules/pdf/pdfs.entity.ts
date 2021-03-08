import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Companies } from '../company/company.entity';

@Entity('Pdfs', { schema: 'public' })
export class Pdfs {
  @PrimaryGeneratedColumn({ type: 'integer', name: 'id' })
  id: number;

  @Column('character varying', { name: 'fileName', length: 255 })
  fileName: string;

  @Column('boolean', {
    name: 'isTemplate',
    nullable: true,
    default: () => false,
  })
  isTemplate: boolean | null;

  @Column('json', { name: 'fields', nullable: true })
  fields: any | null;

  @Column('character varying', {
    name: 'formName',
    nullable: true,
    length: 255,
  })
  formName: string | null;

  @CreateDateColumn({ name: 'createdAt', nullable: true })
  createdAt: Date | null;

  @UpdateDateColumn({ name: 'updatedAt', nullable: true })
  updatedAt: Date | null;

  @Column('character varying', {
    name: 'exportValues',
    nullable: true,
    length: 255,
    default: () => 'Yes',
  })
  exportValues: string | null;

  @Column('integer', {
    name: 'companyId',
    nullable: true,
  })
  companyId: number | null;

  @ManyToOne(() => Companies, (companies) => companies.pdfs, {
    onDelete: 'SET NULL',
    onUpdate: 'CASCADE',
  })
  @JoinColumn([{ name: 'companyId', referencedColumnName: 'id' }])
  company: Companies[];
}

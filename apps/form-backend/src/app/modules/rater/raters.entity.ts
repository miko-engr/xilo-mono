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
import { Coverages } from '../coverage/coverages.entity';
import { Parameters } from '../parameter/Parameters.entity';
import { Companies } from '../company/company.entity';
import { Forms } from '../form/forms.entity';

@Entity('Raters', { schema: 'public' })
export class Raters {
  @PrimaryGeneratedColumn({ type: 'integer', name: 'id' })
  id: number;

  @Column('character varying', { name: 'title', length: 255 })
  title: string;

  @Column('character varying', {
    name: 'carrier',
    nullable: true,
    length: 255,
    default: () => null,
  })
  carrier: string | null;

  @Column('character varying', {
    name: 'state',
    nullable: true,
    length: 255,
    default: () => null,
  })
  state: string | null;

  @CreateDateColumn({ name: 'createdAt' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updatedAt' })
  updatedAt: Date;

  @Column('boolean', { name: 'isAuto', nullable: true })
  isAuto: boolean | null;

  @Column('boolean', { name: 'isHome', nullable: true })
  isHome: boolean | null;

  @Column('integer', { name: 'companyRaterId', nullable: true })
  companyRaterId: number | null;

  @Column('integer', { name: 'formRaterId', nullable: true })
  formRaterId: number | null;

  @OneToMany(() => Coverages, (coverages) => coverages.raterCoverage)
  coverages: Coverages[];

  @OneToMany(() => Parameters, (parameters) => parameters.raterParameter)
  parameters: Parameters[];

  @ManyToOne(() => Companies, (companies) => companies.raters, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn([{ name: 'companyRaterId', referencedColumnName: 'id' }])
  companyRater: Companies[];

  @ManyToOne(() => Forms, (forms) => forms.raters, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn([{ name: 'formRaterId', referencedColumnName: 'id' }])
  formRater: Forms[];
}

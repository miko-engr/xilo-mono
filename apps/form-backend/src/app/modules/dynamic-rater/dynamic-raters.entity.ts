import {
  Column,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Coverages } from '../coverage/coverages.entity';
import { Forms } from '../form/forms.entity';
import { Parameters } from '../parameter/Parameters.entity';

@Entity('DynamicRaters', { schema: 'public' })
export class DynamicRaters {
  @PrimaryGeneratedColumn({ type: 'integer', name: 'id' })
  id: number;

  @Column('character varying', { name: 'title', length: 255 })
  title: string;

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

  @Column('integer', { name: 'companyDynamicRaterId', nullable: true })
  companyDynamicRaterId: number | null;

  @OneToMany(() => Coverages, (coverages) => coverages.dynamicRaterCoverage)
  coverages: Coverages[];

  @OneToMany(() => Forms, (forms) => forms.dynamicRaterForm)
  forms: Forms[];

  @OneToMany(() => Parameters, (parameters) => parameters.dynamicRaterParameter)
  parameters: Parameters[];
}

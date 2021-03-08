import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Answers } from '../../entities/Answers';
import { Companies } from '../company/company.entity';
import { DynamicRates } from '../dynamic-rate/dynamic-rates.entity';

@Entity('DynamicParameters', { schema: 'public' })
export class DynamicParameters {
  @PrimaryGeneratedColumn({ type: 'integer', name: 'id' })
  id: number;

  @Column('json', {
    name: 'conditions',
    nullable: true,
    array: true,
    default: () => [],
  })
  conditions: object[] | null;

  @CreateDateColumn({ name: 'createdAt' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updatedAt' })
  updatedAt: Date;

  @Column({ type: 'integer', name: 'id' })
  answerDynamicParameterId: number;

  @Column({ type: 'integer', name: 'id' })
  companyDynamicParameterId: number;

  @Column({ type: 'integer', name: 'id' })
  dynamicRateDynamicParameterId: number;
  @ManyToOne(() => Answers, (answers) => answers.dynamicParameters, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn([
    { name: 'answerDynamicParameterId', referencedColumnName: 'id' },
  ])
  answerDynamicParameter: Answers[];

  @ManyToOne(() => Companies, (company) => company.dynamicParameters, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn([
    { name: 'companyDynamicParameterId', referencedColumnName: 'id' },
  ])
  companyDynamicParameter: Companies[];

  @ManyToOne(
    () => DynamicRates,
    (dynamicRates) => dynamicRates.dynamicParameters,
    { onDelete: 'CASCADE', onUpdate: 'CASCADE' }
  )
  @JoinColumn([
    { name: 'dynamicRateDynamicParameterId', referencedColumnName: 'id' },
  ])
  dynamicRateDynamicParameter: DynamicRates;
}

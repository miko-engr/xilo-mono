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
import { DynamicCoverages } from '../dynamic-coverage/dynamic-coverages.entity';
import { DynamicParameters } from '../dynamic-parameter/dynamic-parameters.entity';
import { Forms } from '../form/forms.entity';

@Entity('DynamicRates', { schema: 'public' })
export class DynamicRates {
  @PrimaryGeneratedColumn({ type: 'integer', name: 'id' })
  id: number;

  @Column('integer', { name: 'min', nullable: true, default: () => 0 })
  min: number | null;

  @Column('integer', { name: 'max', nullable: true })
  max: number | null;

  @Column('integer', { name: 'base', nullable: true })
  base: number | null;

  @Column('boolean', {
    name: 'hasReplacementCost',
    nullable: true,
    default: () => false,
  })
  hasReplacementCost: boolean | null;

  @Column('integer', { name: 'costPerSqFt', nullable: true })
  costPerSqFt: number | null;

  @Column('integer', { name: 'avBaseSqFt', nullable: true })
  avBaseSqFt: number | null;

  @Column('integer', { name: 'premiumIncreasePerSqFt', nullable: true })
  premiumIncreasePerSqFt: number | null;

  @Column('boolean', {
    name: 'isAnnual',
    nullable: true,
    default: () => true,
  })
  isAnnual: boolean | null;

  @Column('boolean', {
    name: 'isMonthly',
    nullable: true,
    default: () => false,
  })
  isMonthly: boolean | null;

  @CreateDateColumn({ name: 'createdAt' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updatedAt' })
  updatedAt: Date;

  @Column('integer', { name: 'companyDynamicRateId', nullable: true })
  companyDynamicRateId: number | null;

  @Column('integer', { name: 'formDynamicRateId', nullable: true })
  formDynamicRateId: number | null;

  @Column('boolean', {
    name: 'hasMultiplyByVehicles',
    nullable: true,
    default: () => false,
  })
  hasMultiplyByVehicles: boolean | null;

  @OneToMany(
    () => DynamicCoverages,
    (dynamicCoverages) => dynamicCoverages.dynamicRateDynamicCoverage
  )
  dynamicCoverages: DynamicCoverages[];

  @OneToMany(
    () => DynamicParameters,
    (dynamicParameters) => dynamicParameters.dynamicRateDynamicParameter
  )
  dynamicParameters: DynamicParameters[];

  @ManyToOne(() => Forms, (forms) => forms.dynamicRates, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn([{ name: 'formDynamicRateId', referencedColumnName: 'id' }])
  formDynamicRate: Forms[];
}

import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { DynamicRates } from '../dynamic-rate/dynamic-rates.entity';

@Entity('DynamicCoverages', { schema: 'public' })
export class DynamicCoverages {
  @PrimaryGeneratedColumn({ type: 'integer', name: 'id' })
  id: number;

  @Column('character varying', { name: 'title', length: 255 })
  title: string;

  @Column('json', {
    name: 'specs',
    nullable: true,
    array: true,
    default: () => [],
  })
  specs: object[] | null;

  @Column('integer', { name: 'premiumIncrease', nullable: true })
  premiumIncrease: number | null;

  @Column('integer', { name: 'position' })
  position: number;

  @Column('text', { name: 'image', nullable: true })
  image: string | null;

  @CreateDateColumn({ name: 'createdAt' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updatedAt' })
  updatedAt: Date;

  @Column('integer', { name: 'companyDynamicCoverageId', nullable: true })
  companyDynamicCoverageId: number | null;

  @ManyToOne(
    () => DynamicRates,
    (dynamicRates) => dynamicRates.dynamicCoverages,
    { onDelete: 'CASCADE', onUpdate: 'CASCADE' }
  )
  @JoinColumn([
    { name: 'dynamicRateDynamicCoverageId', referencedColumnName: 'id' },
  ])
  dynamicRateDynamicCoverage: DynamicRates[];
}

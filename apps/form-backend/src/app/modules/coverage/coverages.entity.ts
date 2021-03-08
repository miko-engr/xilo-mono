import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Companies } from '../company/company.entity';
import { DynamicRaters } from '../dynamic-rater/dynamic-raters.entity';
import { Raters } from '../rater/raters.entity';
import { Rates } from '../rate/Rates.entity';

@Entity('Coverages', { schema: 'public' })
export class Coverages {
  @PrimaryGeneratedColumn({ type: 'integer', name: 'id' })
  id: number;

  @Column('character varying', { name: 'title', length: 255 })
  title: string;

  @Column('boolean', { name: 'isAuto', nullable: true, default: () => false })
  isAuto: boolean | null;

  @Column('boolean', { name: 'isHome', nullable: true, default: () => false })
  isHome: boolean | null;

  @Column('integer', { name: 'basePrice', nullable: true })
  basePrice: number | null;

  @Column('integer', { name: 'minPrice', nullable: true })
  minPrice: number | null;

  @Column('integer', { name: 'maxPrice', nullable: true })
  maxPrice: number | null;

  @Column('boolean', {
    name: 'isMonthly',
    nullable: true,
    default: () => false,
  })
  isMonthly: boolean | null;

  @Column('boolean', {
    name: 'isAnnual',
    nullable: true,
    default: () => false,
  })
  isAnnual: boolean | null;

  @Column('integer', { name: 'position' })
  position: number;

  @Column('timestamp with time zone', { name: 'createdAt' })
  createdAt: Date;

  @Column('timestamp with time zone', { name: 'updatedAt' })
  updatedAt: Date;

  @Column('character varying', {
    name: 'liabilityLimit',
    nullable: true,
    length: 255,
    default: () => null,
  })
  liabilityLimit: string | null;

  @Column('character varying', {
    name: 'deductible',
    nullable: true,
    length: 255,
    default: () => null,
  })
  deductible: string | null;

  @Column('boolean', {
    name: 'hasMarketValue',
    nullable: true,
    default: () => true,
  })
  hasMarketValue: boolean | null;

  @Column('boolean', {
    name: 'hasDwellingCoverage',
    nullable: true,
    default: () => true,
  })
  hasDwellingCoverage: boolean | null;

  @Column('text', { name: 'image', nullable: true })
  image: string | null;

  @ManyToOne(() => Companies, (companies) => companies.coverages, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn([{ name: 'companyCoverageId', referencedColumnName: 'id' }])
  company: Companies[];

  @ManyToOne(() => DynamicRaters, (dynamicRaters) => dynamicRaters.coverages, {
    onDelete: 'SET NULL',
    onUpdate: 'CASCADE',
  })
  @JoinColumn([{ name: 'dynamicRaterCoverageId', referencedColumnName: 'id' }])
  dynamicRaterCoverage: DynamicRaters[];

  @ManyToOne(() => Raters, (raters) => raters.coverages, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn([{ name: 'raterCoverageId', referencedColumnName: 'id' }])
  raterCoverage: Raters;

  @OneToMany(() => Rates, (rates) => rates.coverageRate)
  rates: Rates[];
}
